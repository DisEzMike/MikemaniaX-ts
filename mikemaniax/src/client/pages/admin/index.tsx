import {
  Container,
  List,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { API_URL } from "../../config/constant";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import AnsiToHtml from 'ansi-to-html';
import moment from "moment";

const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles?.("dark", {
    backgroundColor: "#1A2027",
  }),
  overflowX: "hidden", 
}));

const Admin = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ansiConverter = new AnsiToHtml();

  useEffect(() => {
    const socket = io(API_URL);
    onLog(socket);
  }, []);

  const onLog = (socket: any) => {
    socket.emit("log");

    socket.on("log", (msg: any) => {
      console.log(msg)
      setMessages((prev) => [msg, ...prev]);
      setLoading(false);
    });

    socket.on("log-history", (logs: any[]) => {
      setMessages(logs)
    })
  }

  return (
    <Container>
      <Stack gap={2}>
        <Card elevation={8} style={{ width: "100%" }}>
          
        </Card>

        <Card elevation={8} style={{ width: "100%" }}>
          <Typography variant="h5">ประวัติการใช้งาน</Typography>
          <List
              sx={{
                  bgcolor: '#eee',
                  position: 'relative',
                  overflow: 'auto',
                  height: 300,
                  paddingX: "20px",
                  '& ul': { padding: 0 },
              }}
              subheader={<li />}
          >
            {loading
            ? <li>
                <pre>Loading...</pre>
            </li>
            :
            messages.map((item, i) => (
              <li key={i}>
                  <pre dangerouslySetInnerHTML={{__html: `[${moment(item.timestamp).format("DD/MM/YYYY hh:mm:ss")}] ${ansiConverter.toHtml(item.message)}`}} />
              </li>
            ))}
          </List>
        </Card>
      </Stack>
    </Container>
  );
};

export default Admin;