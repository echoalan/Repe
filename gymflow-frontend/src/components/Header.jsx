const Header = ({ logout }) => {

    return (
      <header className="dashboard-header">
        <h1>🏋️‍♂️ Repe</h1>
        <div className="user-info">
          <button onClick={logout} className="logout-btn">
            Cerrar sesión
          </button>
        </div>
      </header>
    )

}


export default Header;