import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import {defineMessages, intlShape, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import VM from 'clipcc-vm';
import Editor from "@monaco-editor/react";

import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import DOMElementRenderer from './dom-element-renderer.jsx';

class CodeTab extends React.Component {
    constructor (props) {
        super(props);
        /*bindAll(this, [
            'componentDidMount'
        ]);*/
    }

    componentWillReceiveProps (nextProps) {
        const {
            editingTarget,
            sprites,
            stage
        } = nextProps;

        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (!target || !target.sounds) {
            return;
        }

        // If switching editing targets, reset the sound index
        /*if (this.props.editingTarget !== editingTarget) {
            this.setState({selectedSoundIndex: 0});
        } else if (this.state.selectedSoundIndex > target.sounds.length - 1) {
            this.setState({selectedSoundIndex: Math.max(target.sounds.length - 1, 0)});
        }*/
    }

    componentWillMount () {
        /*console.log(this);
        const temp = document.createElement('div');
        temp.setAttribute('style', 'width: 300px; height: 300px');
        console.log(temp);
        this.manaco = monaco.editor.create(temp, {
            value: [
                'function x() {',
                '\tconsole.log("Hello world!");',
                '}'
            ].join('\n'),
            language: 'javascript'
        });
        console.log(temp);
        this.editor = temp;
        console.log(this.editor);*/
    }

    render () {
        return (<Editor
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="// some comment"
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
        //mapDispatchToProps
    )(CodeTab))
);
