import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {intlShape, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import VM from 'clipcc-vm';
import Script from 'clipcc-script';
import scriptLib from '!!raw-loader!clipcc-script/dist/lib.d.ts?raw';
import * as monaco from 'monaco-editor';

import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';

import styles from '../components/code-tab/code-tab.css';

class CodeTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'attachVM',
            'detachVM',
            'handleContainerDidMount',
            'onWorkspaceUpdate'
        ]);

        this.inited = false;
        this.ref = null;
        this.editor = null;
        this.data = '';
        this.script = new Script.Project();
    }

    componentDidUpdate () {
        console.log('didUpdate');
        this.props.vm.refreshWorkspace();
    }

    componentWillUnmount () {
        if (this.inited) {
            this.detachVM();
        }
    }

    attachVM () {
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
    }

    detachVM () {
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
    }

    onWorkspaceUpdate (data) {
        this.script.getScript('stage').loadFromXML(data.xml);
        this.data = this.script.getScript('stage').generateCode();
        this.editor.getModel().setValue(this.data);
        this.editor.getAction('editor.action.formatDocument').run();
    }

    handleContainerDidMount (ref) {
        if (!ref) return;
        this.ref = ref;
        
        const option = monaco.languages.typescript.javascriptDefaults.getCompilerOptions();
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions(Object.assign(option, {
            experimentalDecorators: true
        }));

        const libUri = 'ts:filename/clipcc.d.ts';
        monaco.languages.typescript.javascriptDefaults.addExtraLib(scriptLib, libUri);
        monaco.editor.createModel(scriptLib, 'typescript', monaco.Uri.parse(libUri));

        this.editor = monaco.editor.create(this.ref, {
            value: '// CREATED',
            language: 'javascript'
        });

        this.attachVM();
        this.inited = true;
    }

    render () {
        if (!this.inited && !this.props.isVisible) {
            return null;
        }

        return (<div
            className={styles.codePanel}
            ref={this.handleContainerDidMount}
            style={{
                width: '100%',
                height: '100%',
                display: this.props.isVisible ? 'block' : 'none'
            }}
        />);
    }
}

CodeTab.propTypes = {
    editingTarget: PropTypes.string,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    isRtl: state.locales.isRtl
});

export default errorBoundaryHOC('Code Tab')(
    injectIntl(connect(
        mapStateToProps,
        // mapDispatchToProps
    )(CodeTab))
);
