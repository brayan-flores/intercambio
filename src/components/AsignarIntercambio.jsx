import { Button, Grid } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import logo from '../logo.svg';
import '../App.css';

const AsignarIntercambio = ({allFamilia, usuarioLog}) => {

    const [AssignedInt, setAssignedInt] = useState(false) 
    const [isViewAnimate, setIsViewAnimate] = useState(false)
    const [familiaElegible, setFamiliaElegible] = useState([])
    const [usuarioIntercambio, setUsuarioIntercambio] = useState({})

    console.log(usuarioIntercambio)

    const AsignarIntercambioFun = () => {
        setAssignedInt(true)
        setIsViewAnimate(true)
        getRandomItem(familiaElegible)
       
        setTimeout(()=>{
            setIsViewAnimate(false)
            
        },[5000])
    }

    useEffect(()=>{
        filterGroupAnd()
    }, [])

    const filterGroupAnd = () => {
        let currentFamili = allFamilia

        let filtro = currentFamili.filter(x => x.grupo !== usuarioLog.grupo && x.asignado !== 1)
        console.log(filtro)
        setFamiliaElegible(filtro)
        // getRandomItem(filtro)
    }

    function getRandomItem(array) {
        if (!array || array.length === 0) {
          throw new Error("El array está vacío o no es válido.");
        }
        const randomIndex = Math.floor(Math.random() * array.length); // Seleccionar índice aleatorio
        console.log(array[randomIndex])
        let currentUser = array[randomIndex]
        setUsuarioIntercambio(array[randomIndex])
        console.log(currentUser.id)
        updateChanges(currentUser.id)
        // return array[randomIndex]; // Devolver el objeto en ese índice
      }

    const updateChanges = (id) => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "id": usuarioLog.id,
        "id_asignado": id
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };

        fetch("https://intercambio-9sig.onrender.com/api/asignar-intercambio", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }


    return(
        <Fragment>
         {
            AssignedInt ? 
            <div>
             {
                isViewAnimate ? 
                    <div>
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1>Asignando...</h1>
                    </div>
                    :  
                    // <div
                    //     className="animate__animated animate__zoomIn animate__bounce"
                    //     style={{
                    //       fontSize: "2rem",
                    //       marginTop: "20px",
                    //     //   color: "#ff4d4d",
                    //     }}
                    //   >
                    //     🎆 ¡Felicidades! Tu intercambio es:
                    //     <br/>
                    //     <strong> {usuarioIntercambio.nombre} :) </strong>
                    //      🎆
                    //   </div>  
                    <> 
                        🎆 ¡Felicidades! Tu intercambio es:
                        <br/>
                        <strong> {usuarioIntercambio.nombre} :) </strong>
                         🎆
                    <div class="firework"></div>
                    <div class="firework"></div>
                    <div class="firework"></div>
                    
                    </>
             }
           
            </div>
            :
            <Grid container>
            <h1>¡Elegir a mi intercambio!</h1>
  
            {/* <Button variant="contained" color="sucess">Vamos!</Button> */}
            <Button 
              onClick={()=> AsignarIntercambioFun()}
              sx={{
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  margin: '0 auto'
              }} 
              variant="contained" 
              color="success"
              >
              Vamos!
              </Button>
  
            </Grid>
         }
      
        </Fragment>
    )
}

export default AsignarIntercambio;