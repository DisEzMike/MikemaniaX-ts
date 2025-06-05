import {
  Button,
  Container,
  List,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { API_URL } from "../../config/constant";
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import AnsiToHtml from 'ansi-to-html';
import moment from "moment";
import { ILog } from "../../../server/src/models/log";

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
  const [isLogMax, setIsLogMax] = useState(false);
  const [seq, setSeq] = useState(0);
  const [io, setIO] = useState({} as any);
  const ansiConverter = new AnsiToHtml();
  useEffect(() => {
    const socket = socketIOClient(API_URL);
    setIO(socket);
    onLog(socket);
  }, []);

  const onLog = (socket: any) => {
    socket.emit("log", {from: seq});

    socket.on("log", (msg: any) => {
      setMessages((prev) => [msg, ...prev]);
    });
    
    socket.on("log-history", (logs: any[]) => {
      setMessages(logs)
      setLoading(false);
    });

    socket.on("log-history-range", (logs: any[]) => {
      if (logs.length != 0) {
        setIsLogMax(false);
        setMessages((prev) => [...logs, ...prev]);
      } else setIsLogMax(true)
    });
  }

  const loadMoreLogs = (socket: any) => {
    setSeq((prev) => {
      const newSeq = prev+100;
      socket.emit("log", {from: seq});
      return newSeq;
    });
  }

  const reloadLogs = (socket: any) => {
    setLoading(true);
    setSeq((prev) => {
      socket.emit("log", {from: 0});
      setIsLogMax(false);
      return 0;
    })
  }

  return (
    <Container>
      <Stack gap={2}>
        <Card elevation={8} style={{ width: "100%" }}>
          
        </Card>

        <Card elevation={8} style={{ width: "100%" }}>
          <Stack gap={2} direction="row" justifyContent="space-between">
            <Typography variant="h5">ประวัติการใช้งาน</Typography>
            <Button onClick={() => reloadLogs(io)} style={{marginRight: "10px"}}>Reload</Button>
          </Stack>
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
            messages.sort((a: ILog, b: ILog) => moment(b.timestamp).diff(moment(a.timestamp))).map((item, i) => (
              <li key={i}>
                  <pre dangerouslySetInnerHTML={{__html: `[${moment(item.timestamp).format("DD/MM/YYYY hh:mm:ss")}] ${ansiConverter.toHtml(item.message)}`}} />
              </li>
            ))}
            {!loading && !isLogMax &&            
              <li>
                <Button fullWidth onClick={() => loadMoreLogs(io)}>Load more</Button>
              </li>
            }
            </List>
        </Card>
      </Stack>
    </Container>
  );
};

export default Admin;