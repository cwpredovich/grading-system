const AddStudentButton = () => {
    const styles = {
        addBtn: {
            // position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'green'
        },
        plusSymbol: {
            // position: 'absolute',
            top: '50%',
            left: '50%',
            // transform: 'translate(-50%, -50%)',
            // color: 'white',
            fontSize: '25px',
            alignContent: 'center'

        }
    }
    return (
        <div className="green-plus" style={styles.addBtn}>
            <div style={styles.plusSymbol}>
                +
            </div>
        </div>
    )
}

export default AddStudentButton