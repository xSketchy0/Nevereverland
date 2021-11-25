import Highway from "@dogstudio/highway"

class CustomRenderer extends Highway.Renderer {
    onEnter() {
        console.log("test")
    }
}

export default CustomRenderer;