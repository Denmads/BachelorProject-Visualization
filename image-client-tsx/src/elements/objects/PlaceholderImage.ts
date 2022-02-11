import img_placeholder from "../../img_placeholder.svg";

class PlaceholderImage {
    private static INSTANCE: HTMLImageElement | null = null;

    public static getInstance(): HTMLImageElement {
        if (PlaceholderImage.INSTANCE == null) {
            PlaceholderImage.INSTANCE = new Image();
            PlaceholderImage.INSTANCE.src = img_placeholder;
            return new Image();
        }
        else {
            return PlaceholderImage.INSTANCE;
        }
    }
}

export default PlaceholderImage