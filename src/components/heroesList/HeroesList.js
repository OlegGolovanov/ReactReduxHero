import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
    heroesFetched} from '../../reducers/heroesSlice';
import {reduxThunkHeroes} from "../../reducers/heroesSlice"
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';


// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, heroesLoadingStatus} = useSelector(state => state.heroesSlice);
    const {activeBTN} = useSelector(state => state.activeBTNSlice);
    const dispatch = useDispatch();
    
    useEffect(() => { 
        dispatch(reduxThunkHeroes())
// eslint-disable-next-line
    }, []);


    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const deleteElementHeroes = (name) =>{
        dispatch(heroesFetched(heroes.filter(item=> item.name!==name)))
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }
        return arr.map(({id, ...props}) => {
            if(activeBTN.length === 0 || activeBTN === "Все") {
                return <HeroesListItem deleteElementHeroes={deleteElementHeroes}  key={id} {...props}/>
            }
            if(props.element === activeBTN && activeBTN.length !== 0) {
                return <HeroesListItem deleteElementHeroes={deleteElementHeroes} key={id} {...props}/>
            } else {
                return null
            }            
        })
    }


    const elements = renderHeroesList(heroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;