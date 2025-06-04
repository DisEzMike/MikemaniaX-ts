import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import { API_URL } from "../../config/constant";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import AnsiToHtml from 'ansi-to-html';
import moment from "moment";

const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles?.("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const Admin = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ansiConverter = new AnsiToHtml();

  useEffect(() => {
    const socket: Socket = io(API_URL);

    socket.on("log", (msg: any) => {
      setMessages((prev) => [msg, ...prev]);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box width="100%" height="100%">
      <Stack gap={2}>
        <Card elevation={8} style={{ width: "100%" }}>
          {loading ? (
            <>Loading...</>
          ) : (
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    height: 300,
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
              {messages.map((item, i) => (
                <li key={i}>
                    <pre dangerouslySetInnerHTML={{__html: `${moment(item.timestamp)} ${ansiConverter.toHtml(item.message)}`}} />
                </li>
              ))}
            </List>
          )}
        </Card>
      </Stack>
    </Box>
  );
};

export default Admin;