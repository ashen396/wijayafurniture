export default function LogoutModal({ props }) {

    function Logout() {

        if (localStorage.length > 0)
            localStorage.clear()

        props('user')   //Passes the 'removes user' state from profile component and uses it to remove the cookie

        window.location.reload()
    }

    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Are you sure you want to log out?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={() => Logout()}>Log out</button>
                </div>
            </div>
        </div>
    )
}