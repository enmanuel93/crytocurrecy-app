import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import useModena from '../Hooks/useMoneda';
import useCriptomoneda from '../Hooks/useCriptomoneda';
import Axios from 'axios';
import Error from './Error';
import PropTypes from 'prop-types';

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover{
        background-color: #326AC0;
        cursor: pointer;
    }
`;

const Formulario = ({guardarMoneda, guardarCriptoMoneda}) => {

    //state del listado de criptomonedas
    const [listadocripto, guardarCriptomonedas] = useState([]);
    const [error, guardarError] = useState(false);

    const MONEDAS = [
        {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
        {codigo: 'MXN', nombre: 'Peso Mexicano'},
        {codigo: 'EUR', nombre: 'Euro'},
        {codigo: 'GBP', nombre: 'Libra Esterlina'},
        {codigo: 'COD', nombre: 'Peso Colombiano'}
    ]

    //Utilizar useModena
    const [ moneda, SelectMonedas] = useModena('Elige tu moneda', '', MONEDAS);

    //Utilizar useCriptomoneda
    const [ criptomoneda, SelectCripto] = useCriptomoneda('Elige tu criptomoneda', '', 
    listadocripto);

    //Ejecutar llamado a la API
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await Axios.get(url);

            guardarCriptomonedas(resultado.data.Data);
        }

        consultarAPI();
    }, []);

    //cuando el usuario hace submit
    const cotizarMoneda = e =>{
        e.preventDefault();

        //validar si ambos campos estan llenos
        if(moneda === '' || criptomoneda === ''){
            guardarError(true);
            return;
        }

        //pasar los datos al componente principal
        guardarError(false);

        guardarMoneda(moneda);
        guardarCriptoMoneda(criptomoneda);
    }

    return ( 
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}

            <SelectMonedas />

            <SelectCripto />
            
            <Boton 
                type="submit"
                value="Calcular"
            />
        </form>
    );
}

Formulario.propTypes = {
    guardarMoneda: PropTypes.func.isRequired, 
    guardarCriptoMoneda: PropTypes.func.isRequired, 
}
 
export default Formulario;