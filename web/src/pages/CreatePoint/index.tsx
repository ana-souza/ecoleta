import React, {useEffect, useState, ChangeEvent} from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api'
import axios from 'axios'

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {

    const[items, setItems] = useState<Item[]>([]);
    const[ufs, setUfs] = useState<string[]>([]);
    const[cities, setCities] = useState<string[]>([]);

    const[selectUf, setSelectUf] = useState('0');

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGECityResponse[]>(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`).then(response => {
            const cityNames = response.data.map( city => city.nome);
            setCities(cityNames);
        });
    }, []);

    useEffect(() => {

        if (selectUf === '0') {
            return;
        }

        axios.get<IBGEUFResponse[]>('http://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const UfInitials = response.data.map(uf => uf.sigla);
            setUfs(UfInitials);
        });
    }, [selectUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectUf(uf);

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form action="">
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input 
                        type="text"
                        name="name"
                        id="name"
                        />

                    <label htmlFor="name">Whatsapp</label>
                        <input 
                        type="text"
                        name="whatsapp"
                        id="whatsapp"
                        />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-23.7451918, -46.6802013]} zoom={15}>
                    <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[-23.7451918, -46.6802013]} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado </label>
                            <select name="uf" id="uf" value={selectUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade </label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}     
                        
                    </ul>
                </fieldset>

            </form>
            
        </div>
    )
}

export default CreatePoint;