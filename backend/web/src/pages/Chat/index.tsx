import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import liff from '@line/liff';
import { useLayoutEffect, useState } from 'react';

import { getAllUser } from '../../functions/user';
import Skeleton from '@mui/material/Skeleton';
const DM = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);    
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
      const liffInit = async () => {
        await liff.init({ liffId: '2007482513-EZ1ngjap' });
      };

      liffInit();
      
      getUser();
    }, []);
    
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token")!;
        const res = await getAllUser(token);
        
        setUsers(res.data);
        setLoading(false);

      } catch (error) {
        console.log(error)
      }
    }
  
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
      }}
    >
      {loading 
        ?
        [1,2,3,4,5,6,7,8,9,10].map((i) => (
          <Stack key={i} direction="row" spacing={2} sx={{marginTop: "20px"}}>
            <Skeleton variant="circular" width={55} height={55} />
            <Skeleton variant="rounded" width="80%" height={55} />
          </Stack> 
        ))
        : users.map((user: any, index) => (
        <Card key={index}>
          <CardActionArea
            onClick={() => navigate(`/chat/${user.userId}`)}
            sx={{
              height: '100%',
              '&[data-active]': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          >
            <CardContent sx={{ height: '100%' }}>
                <Stack direction="row" spacing={2} sx={{alignItems: "center"}}>
                    <Avatar alt={user.displayName} src={user.pictureUrl} />
                    <Stack direction="column">
                        <Typography variant="h6" component="div">{user.displayName}</Typography>
                        <Typography variant="body2" component="div" >{user.statusMessage}</Typography>
                    </Stack>
                </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default DM;
