import Dialog from '@material-ui/core/Dialog';
import React, { ChangeEvent } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, DialogContent, FormControl, InputLabel, List, ListItem, MenuItem, Select, Theme } from '@material-ui/core';
import GraphConfigData, { InputType } from './GraphConfigData';
import { GraphConfiguration } from '../../elements/types';
import { getItemDescription } from '../../specific/specific';
import RenderController from '../RenderView/RenderController';
import RenderItemStorage from '../../elements/RenderItemStorage';
import createInputComponent from './InputComponentFactory';

class GraphConfigDialog extends React.Component<{onClose: () => void, open: boolean}, {graphType: string | undefined, currentConfigs: GraphConfiguration}>{

    state = {
        graphType: "Grid",
        currentConfigs: {

        } as GraphConfiguration
    }

    stateCopy: {graphType: string | undefined, currentConfigs: GraphConfiguration} = {
        graphType: "", currentConfigs: {}
    }

    componentDidMount() {
        let params: GraphConfiguration = {};
        GraphConfigData["Grid"].vars.map(description => {
            let defaultVal: any;
            switch (description.type) {
                case InputType.INT:
                    defaultVal = (description.extra ? description.extra.defaultValue : 0);
                    break;
                default:
                    defaultVal = "";
                    break;
            }

            params[description.name] = defaultVal;
        });
        this.setState(state => ({...state, currentConfigs: params}));
    }

    handleGraphChange(event: ChangeEvent<{name?: string| undefined, value: unknown}>) {
        let params: GraphConfiguration = {};
        GraphConfigData[event.target.value as string].vars.map(description => {
            let defaultVal: any;

            if (this.state.currentConfigs[description.name] !== undefined) {
                defaultVal = this.state.currentConfigs[description.name];
            }
            else {
                switch (description.type) {
                    case InputType.INT:
                        defaultVal = (description.extra ? description.extra.defaultValue : 0);
                        break;
                    case InputType.PROPERTY:
                        defaultVal = {
                            propertyName: "",
                            propertyType: "",
                            propertyUnit: ""
                        };
                        break;
                    default:
                        defaultVal = "";
                        break;
                }
            }

            params[description.name] = defaultVal;
        })
        this.setState(state => ({graphType: event.target.value as string, currentConfigs: params}));
    }

    handleParamChange(paramName: string, value: any) {
        this.setState(state => ({...state, currentConfigs: {...state.currentConfigs, [paramName]: value}}));
    }

    handleOpen() {
        this.stateCopy = JSON.parse(JSON.stringify(this.state));
    }

    handleApply() {
        this.stateCopy = JSON.parse(JSON.stringify(this.state));
        this.props.onClose();
        RenderController.SetCurrentGraph(new GraphConfigData[this.state.graphType].creator.graphClass(this.state.currentConfigs));
        RenderItemStorage.recreateQuadTreeWithoutReload();
    }

    handleCancel() {
        this.props.onClose();
        this.setState(state => this.stateCopy);
    }

    render() {

        return (
            <Dialog open={this.props.open} onClose={this.handleCancel.bind(this)} onEnter={this.handleOpen.bind(this)}>
                <DialogTitle>Graph Configuration</DialogTitle>
                <DialogContent>
                    <FormControl style={{minWidth: "200px"}}>
                        <InputLabel id="graph-type-label">Graph Type</InputLabel>
                        <Select
                        labelId="graph-type-label"
                        id="graph-type-select"
                        value={this.state.graphType}
                        onChange={this.handleGraphChange.bind(this)}
                        >
                        <MenuItem value={"Grid"}>No Axis (Grid)</MenuItem>
                        <MenuItem value={"OneAxis"}>One Axis Graph</MenuItem>
                        <MenuItem value={"TwoAxis"}>Two Axis Graph</MenuItem>
                        </Select>
                    </FormControl>
                    <hr />
                    <List>
                        {GraphConfigData[this.state.graphType].vars.map(description => {
                            let comp = createInputComponent(description.name, this.state.currentConfigs[description.name], this.handleParamChange.bind(this), description.type, (description.extra ? description.extra as {[name: string]: any} : {}));
                            return (
                                <ListItem key={description.name}>
                                    {comp}
                                </ListItem>
                            );
                        })}
                        <ListItem key="apply_btn">
                            <Button variant="contained" color="primary" onClick={this.handleApply.bind(this)}>Apply</Button>
                        </ListItem>
                    </List>
                </DialogContent>
            </Dialog>
        );
    }
}

export default GraphConfigDialog