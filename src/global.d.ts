

declare module 'react-color'{
    type SketchPickerProps = {
        onChange: (color: any) => void,
        color: any
    }
    function SketchPicker(props: SketchPickerProps)
}