import { Box, Dialog, DialogTitle } from "@material-ui/core";
import React from "react";
import RenderItem from "../../elements/objects/RenderItem";
import { getItemDescription } from "../../specific/specific";
import styles from "./DetailsGUI.module.css"
import PropertyPanel from "./PropertyPanel"

class DetailsGUI extends React.Component<{onClose: () => void, open: boolean, item: RenderItem}, {}> {

    render() {
        if (this.props.item == null) {
            return (<Box></Box>)
        }

        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} scroll="paper">
                <Box display="flex" padding="20px">
                    <Box display="flex" flexDirection="column">
                        <DialogTitle>Details</DialogTitle>
                        {this.props.item != null && <img width="300px" src={this.props.item.getImage().src} />}
                        <Box display="flex" flexDirection="column" className={styles.propertyContainer}>
                            {
                                Object.entries(getItemDescription()).map(val => {
                                    return ((!val[1].optional || this.props.item.properties.getProperty(val[0])) && <PropertyPanel name={val[0]} description={val[1]} item={this.props.item}></PropertyPanel>)
                                })
                            }
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        );
    }
}

export default DetailsGUI