import Icon from "@mui/material/Icon";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import { InputBase, type SxProps } from "@mui/material";
import './InputFieldStyle.css';
import { useRef, useState, type FormEvent } from "react";

type InputFieldProps = {
    onSubmit: (e: FormEvent<HTMLFormElement>, input: string | null) => {}
    sx?: SxProps
}

const InputField = (props: InputFieldProps) => {
    const {onSubmit} = props
    const [input, setInput] = useState("");
    const [row, setRow] = useState(9);

    const ref = useRef(null);

    const onChangeInput = (e: any) => {
        setInput(e.target.value)
    }

    const x = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input == "") return
        onSubmit(e, input);
        setInput("");
    }
    return ( 
        <AppBar component="nav" sx={{...props.sx, top: 'auto', bottom: 0, backgroundColor: "#ffffff" }}>
            <form onSubmit={x}>
            <Grid container spacing={1} sx={{alignItems: "center", justifyContent: "center", paddingTop: "10px", paddingX: "10px", paddingBottom:"10px"}}>
                <Grid size={10}>
                    <Box sx={{
                        border: "1px solid black",
                        borderRadius: "50px",
                        paddingX: "20px",
                        paddingY: "5px"
                    }}>
                        <InputBase
                            id="inputMsg"
                            className="expandable-input"
                            ref={ref}
                            value={input}
                            onChange={onChangeInput}
                            fullWidth
                            placeholder="Aa"
                            multiline
                            maxRows={row}
                            onBlur={() => setRow(1)}
                            onFocus={() => setRow(9)}
                        />
                    </Box>
                </Grid>
                <Grid size={1}>
                    <IconButton type="submit" onClick={() => document.getElementById("inputMsg")?.focus()}>
                        <Icon>send</Icon>
                    </IconButton>
                </Grid>
            </Grid>
            </form>
        </AppBar>
     );
}
 
export default InputField;