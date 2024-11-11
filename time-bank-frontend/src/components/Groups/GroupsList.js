import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const GroupsList = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No estás autenticado. Por favor, inicia sesión.');
                window.location.href = '/login'; // Redirigir al login si no hay token
                return;
            }

            const fetchGroups = async () => {
                try {
                    const response = await api.get('/groups', {
                        headers: {
                            Authorization: token,
                        },
                    });
                    setGroups(response.data);
                } catch (error) {
                    console.error('Error fetching groups:', error);
                }
            };

            fetchGroups();
        } catch (error) {
            console.error('Error fetching groups:', error);
        }      
    }, []);

    return (
        <div>
            <h1>Groups List</h1>
            <ul>
                {groups.map(group => (
                    <Link to= {`/groups/details/${group.id}`}><li key={group.id}>{group.nombre}</li></Link>
                ))}
            </ul>
        </div>
    );
};

export default GroupsList;