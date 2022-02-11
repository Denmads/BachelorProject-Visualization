import FilterList from "@material-ui/icons/FilterList";
import React from 'react';
import SpeedDial, { OpenReason } from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SettingsIcon from '@material-ui/icons/Settings';
import FilterDialog from "../FilterGUI/FilterDialog";
import GraphConfigDialog from "../GraphConfigGUI/GraphConfigDialog";

class MenuFAB extends React.Component<{}, {menuOpen: boolean, filterOpen: boolean, displayOpen: boolean}> {
    
    state = {
        menuOpen: false,
        filterOpen: false,
        displayOpen: false
    }



    render() {
        return (
            <div>
                <SpeedDial 
                    ariaLabel="Menu"
                    icon={<SpeedDialIcon />}
                    onClose={() => this.setState(state => ({...state, menuOpen: false}))}
                    onOpen={(ev: React.SyntheticEvent<{}, Event>, reason: OpenReason) => {
                        if (reason != "focus")
                            this.setState(state => ({...state, menuOpen: true}))
                    }}
                    open={this.state.menuOpen}
                    direction="down"
                    style={{position: "absolute", top: "8px", right: "8px"}}
                >
                    <SpeedDialAction 
                        key="Filter"
                        icon={<FilterList />}
                        tooltipTitle="Filter"
                        onClick={()=>{
                            this.setState(state => ({...state, filterOpen: true}));
                        }}
                    />
                    <SpeedDialAction 
                        key="Display"
                        icon={<SettingsIcon />}
                        tooltipTitle="Display"
                        onClick={()=>{
                            this.setState(state => ({...state,displayOpen: true}));
                        }}
                    />
                </SpeedDial>
                <FilterDialog open={this.state.filterOpen} onClose={()=> this.setState(state => ({...state, menuOpen: false, filterOpen: false}))} />
                <GraphConfigDialog open={this.state.displayOpen} onClose={()=> this.setState(state => ({...state, menuOpen: false, displayOpen: false}))} />
            </div>
        );
    }
}

export default MenuFAB