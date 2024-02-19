const Notification = ({ messageType, message }) => {
    return message && <div className={messageType}>{message}</div>;
};
export default Notification;
