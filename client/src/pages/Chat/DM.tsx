import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Message} from '../../components/message';
import { AppBar, Icon, IconButton, Paper, styled, Toolbar } from '@mui/material';
import InputField from '../../components/InputField';
import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { getUser } from '../../functions/user';

import socketIOClient from 'socket.io-client'
import { API_URL, type Message as MessageType } from '../../config/constant';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: (theme.vars ?? theme).palette.text.secondary,
	...theme.applyStyles('dark', {
		backgroundColor: '#1A2027',
	}),
}));

const skeletonMockData: MessageType[] = [
    {userId: "0", message: "TestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z", sender: true},
    {userId: "0", message: "Test", timestamp: "2025-05-29T13:24:39.569Z"},
    {userId: "0", message: "TestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z"},
    {userId: "0", message: "TestTest", timestamp: "2025-05-29T13:24:39.569Z"},
    {userId: "0", message: "TestTest", timestamp: "2025-05-29T13:24:39.569Z", sender: true},
    {userId: "0", message: "TestTestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z", sender: true},
    {userId: "0", message: "TestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z"},
    {userId: "0", message: "Test", timestamp: "2025-05-29T13:24:39.569Z"},
    {userId: "0", message: "TestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z", sender: true},
    {userId: "0", message: "TestTestTestTestTestTestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z", sender: true},
    {userId: "0", message: "TestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z"},
    {userId: "0", message: "TestTestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z", sender: true},
    {userId: "0", message: "TestTestTestTestTest", timestamp: "2025-05-29T13:24:39.569Z"},
]

const Dm = () => {
	const { userId } = useParams();
    const navigate = useNavigate();
	const [user, setUser] = useState({} as any);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState([] as any);

    const messagesEndRef = useRef(null);

    const socket = socketIOClient(API_URL);

    useLayoutEffect(() => {
       loadData();
    }, [])

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await getUser(token!, userId!);
            setUser(res.data);

            socket.emit("join chat", {room: userId});
            onMessage();

            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    };

    const onMessage = () => {
        
        let temp = message;
        socket.on("chat message", (newMsg: any) => {
            if (temp.length != 0 && temp[temp.length-1]._id == newMsg._id) return;
            temp.push(newMsg);
            setMessage(temp);
            loadData();

            if (messagesEndRef.current) (messagesEndRef.current as HTMLDivElement).scrollIntoView({ behavior: "instant" });
        });

        socket.on("chat history", (arrMsg) => {
            temp = arrMsg;
            console.log(temp)
            setMessage(temp);
            if (messagesEndRef.current) (messagesEndRef.current as HTMLDivElement).scrollIntoView({ behavior: "instant" });
        })
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>, input: string | null) => {
        e.preventDefault()

        if (!input) return;
        socket.emit("chat message", {
            room: userId,
            userId: "1",
            message: input
        });
    }
	return (
        <>
            { loading
            ?
            <Box sx={{ width: '100%', height: "100%" }}>
                <Stack direction="column" spacing={0} sx={{
                    height: "100%",
                    overflowY: "hidden",
                    overflowX: "hidden",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                }}>
                    {/* User Profile */}
                    <AppBar component="nav" style={{backgroundColor: "#fff"}}>
                        <Toolbar>
                            <Stack direction="row" spacing={2} alignItems="center" position="fixed">
                                <IconButton onClick={() => navigate("/")}>
                                    <Icon>arrow_back_ios</Icon>
                                </IconButton>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{height: "50px"}}></Box>
                    {/* Chat message */}
                    <Item sx={{height: 8/10, overflowY: 'auto', overflowX: 'hidden'}} elevation={0}>
                        <Stack spacing={0} sx={{
                            justifyContent: "flex-end",
                            alignItems: "stretch",
                        }}>
                            {skeletonMockData.map((message) => <Message message={message} user={user} sender={message.sender} loading />)}
                            
                        </Stack>
                    </Item>

                    {/* Send Action */}
                    {/* <Item sx={{height: 1}} elevation={3}></Item> */}
                    <Box sx={{height: "50px"}}></Box>
                    <InputField onSubmit={async (e, i) => onSubmit(e, i)} />

                </Stack>
            </Box>
            :
            <Box sx={{ width: '100%', height: "100%" }}>
                <Stack direction="column" spacing={0} sx={{
                    height: "100%",
                    overflowY: "hidden",
                    overflowX: "hidden",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                }}>
                    {/* User Profile */}
                    <AppBar component="nav" style={{backgroundColor: "#fff"}}>
                        <Toolbar>
                            <Stack direction="row" spacing={2} alignItems="center" position="fixed">
                                <IconButton onClick={() => navigate("/")}>
                                    <Icon>arrow_back_ios</Icon>
                                </IconButton>
                                {/* <Avatar src={user.photo} /> */}
                                <Stack direction="column" spacing={0}>
                                    <Typography variant="h6" component="div" color="textPrimary">{user.displayName}</Typography>
                                </Stack>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{height: "50px"}}></Box>
                    {/* Chat message */}
                    <Item sx={{height: 8/10, overflowY: 'auto', overflowX: 'hidden'}} elevation={0}>
                        <Stack spacing={0} sx={{
                            justifyContent: "flex-end",
                            alignItems: "stretch",
                        }}>
                            {message.map((msg: MessageType, i: number) => {
                                return <Message key={i} message={msg} user={user} sender={msg.userId=="1"} />
                            })}
                            <Box ref={messagesEndRef} width={50} height={125}></Box>
                        </Stack>
                    </Item>

                    {/* Send Action */}
                    <InputField onSubmit={async (e, i) => onSubmit(e, i)} />

                </Stack>
            </Box>
            }
        </>
	);
};

export default Dm;
