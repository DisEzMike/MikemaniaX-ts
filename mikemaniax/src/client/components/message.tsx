import Avatar from "@mui/material/Avatar"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import moment from 'moment';
import type { Message as MessageType } from "../config/constant";

type MessageProp = {
    message: MessageType
    user: any
    sender?: boolean
    loading?: boolean
}

export const Message = (prop:  MessageProp) => {
    const {message, user, sender, loading} = prop;

    const time = moment(message.timestamp).format("HH:mm")

    return ( 
        <>
            <Stack direction="row" spacing={2} alignItems="flex-end" sx={{
                width: "100%",
                display: "flex",
                marginTop: "15px",
                justifyContent: sender ? "end" : "start"
            }}>
                {!sender && !loading && <Avatar src={user.pictureUrl} />}
                {!sender && loading &&
                    <Skeleton variant="circular" width={40} height={40}>
                        <Avatar />
                    </Skeleton>  
                }
                {sender &&  <Typography variant="caption" marginTop="-12px">{time} น.</Typography>}
                <Stack direction="column" alignContent="flex-end" sx={{marginRight: 0}}>
                    {loading
                    ?
                    <Skeleton height={60}>
                        <Typography variant="caption" sx={{
                            maxWidth: "100%",
                            wordWrap: "break-word",
                            marginBottom: "15px",
                            padding: "10px 16px",
                            borderRadius: "18px",
                            borderTopRightRadius: sender ? "5px" : "18px",
                            borderTopLeftRadius: !sender ? "5px" : "18px",
                            backgroundColor: sender ? "#0f69bd" :"#dcdcdc",
                            color: sender ? "#fff" :"#111",
                            textAlign: "justify"
                        }}>
                            {message.message}
                        </Typography>
                    </Skeleton>
                    :
                        <Typography variant="caption" sx={{
                            maxWidth: "200px",
                            wordWrap: "break-word",
                            marginLeft: "-10px",
                            padding: "10px 15px 10px 17px",
                            borderRadius: "18px",
                            borderTopRightRadius: sender ? "5px" : "20px",
                            borderBottomLeftRadius: !sender ? "5px" : "20px",
                            backgroundColor: sender ? "#0f69bd" :"#dcdcdc",
                            color: sender ? "#fff" :"#111",
                            textAlign: "justify"
                        }}>
                            {message.message}
                        </Typography>
                    }
                </Stack>
                {!sender &&  <Typography variant="caption" marginTop="-12px">{time} น.</Typography>}
                <Stack alignItems="center">
                </Stack>
            </Stack>
        </>
     );
}