import { useRedirectHomeUnlessUserIsAdmin } from "../admin/useRedirectHomeUnlessUserIsAdmin";
function AdminMessages({ user }) {
    useRedirectHomeUnlessUserIsAdmin({ user });
    return (<div>Hello world!</div>);
}
export default AdminMessages;
//# sourceMappingURL=MessagesPage.jsx.map