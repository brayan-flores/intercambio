import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from "@mui/material";
import AsignarIntercambio from "./AsignarIntercambio";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const FormularioInicio = () => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const nextSectionRef = useRef(null);
  const [isIddentiti, setIsIdentiti] = useState(false)
  const [familia, setFamilia] = useState([])
  const [allFamilia, setAllFamilia] = useState([])
  const [usuarioLog, setUsuarioLog] = useState({})

  useEffect(()=>{
    fetchFamilia()
   
  }, [])

   console.log(personName)

  const fetchFamilia = () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      fetch("https://intercambio-9sig.onrender.com/api/familia_brayan", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(JSON.parse(result))
            let filtrarAsignados = JSON.parse(result)
            setAllFamilia(JSON.parse(result))
            let filtro = filtrarAsignados.filter(x => x.intercambio == 0)
            setFamilia(filtro)
        })
        .catch((error) => console.error(error));
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );

    // let currentPersonName = personName
    let filter = familia.filter(x => x.nombre ==  event.target.value)
    setUsuarioLog(filter[0])
  };

  const handleScroll = () => {
    setIsIdentiti(true)
    nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Fragment>
      {/* Primera sección con altura completa */}
      <div
        style={{
          height: '100vh',
        //   backgroundColor: '#2E3B55',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1>Intercambio Navideño Familia</h1>
        <h4>Selecciona quien eres</h4>
        <FormControl sx={{ m: 1, width: 300, backgroundColor: 'white' }}>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {familia.map((miembro) => (
              <MenuItem
                key={miembro.id}
                value={miembro.nombre}
                style={getStyles(miembro.nombre, personName, theme)}
              >
                {miembro.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <Button
          variant="contained"
          color="success"
          onClick={handleScroll}
          disabled={personName.length > 0 ? false : true }
        >
          Confirmar
        </Button>
      </div>

      {/* Segunda sección que se mostrará al hacer scroll */}
      <div
        ref={nextSectionRef}
        style={{
          height: '100vh',
        //   backgroundColor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {
            isIddentiti ? <AsignarIntercambio allFamilia={allFamilia} usuarioLog={usuarioLog} /> : 
        <h2>¡Necesitas identificarte primero, vuelve arriba!</h2>
        }   
      </div>
    </Fragment>
  );
};

export default FormularioInicio;
