import PropTypes from 'prop-types';
import React, { createRef } from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import VM from 'clipcc-vm';
import Script from 'clipcc-script';
import * as monaco from 'monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';

import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';

class CodeTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'attachVM',
            'detachVM',
            'handleContainerDidMount',
            'onWorkspaceUpdate'
        ]);

        this.editorRef = createRef();
        this.defaultData = '// some comment';
        this.script = new Script.Project();
    }

    componentDidMount () {
        this.attachVM();
    }

    attachVM () {
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
    }

    detachVM () {
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
    }

    onWorkspaceUpdate (data) {
        /*this.script.getScript('stage').loadFromXML(data.xml);
        this.defaultData = this.script.getScript('stage').generateCode();
        if (this.editorRef.current) {
            this.editorRef.current.setValue(this.defaultData);
        }
        console.log(this.defaultData);*/
    }

    handleContainerDidMount (ref) {
        this.ref = ref;

        monaco.editor.create(this.ref, {
            value: '// CREATED',
            language: 'javascript'
        });
    }

    render () {
        return (<div
            ref={this.handleContainerDidMount}
            style={{
                width: '100%',
                height: '100%'
            }}
        />);
    }
}

CodeTab.propTypes = {
    editingTarget: PropTypes.string,
    intl: intlShape,
    isRtl: PropTypes.bool,
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
