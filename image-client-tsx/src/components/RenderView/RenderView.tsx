import React, { MutableRefObject } from 'react';
import ItemPropertyStorage from '../../elements/ItemPropertyStorage';
import InputHandler from './InputHandler'
import RenderController from './RenderController';
import DetailsGUI from '../DetailsGUI/DetailsGUI';
import RenderItem from '../../elements/objects/RenderItem';
import DetailsManager from '../../elements/DetailsManager'

class RenderView extends React.Component<{}, {detailsOpen: boolean, item: RenderItem | null}> {

    state = {
        detailsOpen: false,
        item: null
    }

    constructor(props: {}) {
        super(props);

        this.showDetails = this.showDetails.bind(this);
        DetailsManager.show = this.showDetails;
    }

    canvasRef = React.createRef<HTMLCanvasElement>() as MutableRefObject<HTMLCanvasElement>;
    controller: RenderController | undefined;
    inputHandler: InputHandler | undefined;

    componentDidMount() {
        this.canvasRef.current.width = window.innerWidth;
        this.canvasRef.current.height = window.innerHeight;

        let ctx = this.canvasRef.current.getContext("2d") as CanvasRenderingContext2D;

        this.controller = new RenderController(ctx);
        this.controller.startRendering();
        ItemPropertyStorage.updateItems();

        this.inputHandler = new InputHandler(this.canvasRef.current, this.controller);
    }

    showDetails(item: RenderItem) {
        this.setState({
            detailsOpen: true,
            item: item
        });
    }

    render() {
        return (
            <>
                <canvas ref={this.canvasRef} ></canvas>
                <DetailsGUI item={this.state.item!!} open={this.state.detailsOpen} onClose={() => {this.setState({detailsOpen: false});}} ></DetailsGUI>
            </>
        )
    }
}

export default RenderView