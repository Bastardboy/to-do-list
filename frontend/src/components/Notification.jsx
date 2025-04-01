import React, { useState, useEffect } from 'react';
import './Notification.css'; // Asegúrate de crear un archivo CSS para los estilos

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div className={`notification notification-${type}`}>
            {message}
        </div>
    );
};

export default Notification;