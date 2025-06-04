import { Box, Container, Paper, Stack, styled } from "@mui/material";
import { API_URL } from "../../config/constant";
import socketIOClient from 'socket.io-client'
import { useLayoutEffect } from "react";

const Card = styled(Paper)(({ theme }) => ({
	backgroundColor: '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: (theme.vars ?? theme).palette.text.secondary,
	...theme.applyStyles('dark', {
		backgroundColor: '#1A2027',
	}),
}));

const Admin = () => {
    const socket = socketIOClient(API_URL);

    useLayoutEffect(() => {
        socket.on("log", (msg) => {
            console.log(msg);
        })
    });
    return (
    <Box width="100%" height="100%">
        <Stack gap={2}>
            <Card elevation={8}>
                Hello
            </Card>
        </Stack>
    </Box>
);
}
 
export default Admin;