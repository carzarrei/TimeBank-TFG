import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const GroupDetails = () => {
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const groupId = window.location.pathname.split('/').pop();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = '/login'; // Redirigir al login si no hay token
            return;
        }
        // Fetch group details
        api.get(`/groups/${groupId}`, {
            headers: {
                Authorization: token,
            },
        }
        )
            .then(response => {
                setGroup(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the group details!', error);
            });

        // Fetch group members
        api.get(`/groups/${groupId}/members`, {
            headers: {
                Authorization: token,
            },
        }
        )
            .then(response => {
                setMembers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the group members!', error);
            });
            
            
    }, [groupId, token]);

    const joinGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/groups/${groupId}/join`, {}, {
                headers: {
                    Authorization: token,
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error joining group:', error);
        }
    }

    const leaveGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/groups/${groupId}/leave`, {}, {
                headers: {
                    Authorization: token,
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    }

    const esMiembro = members.some(
        (miembro) => miembro.id == userId);

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{group.nombre}</h1>
            <h2>Members</h2>
            <ul>
                {members.map(member => (
                    <Link to={`/profile/${member.id}`} key={member.id}><li>{member.nombreCompleto}</li></Link>
                ))}
            </ul>
            <div>
                {!esMiembro && (
                    <button onClick={joinGroup}>Join group</button>)}
            </div>
            <div>
                {esMiembro && (
                    <button onClick={leaveGroup}>Leave group</button>)}
            </div>
        </div>
    );
};

export default GroupDetails;