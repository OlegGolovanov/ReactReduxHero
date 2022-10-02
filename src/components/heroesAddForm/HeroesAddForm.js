import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHttp} from '../../hooks/http.hook';
import { filterFetched } from '../../actions';
import * as yup from 'yup';


// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    // Добавление героя
    const [stateHeroes, setStateHeroes] = useState({
        "name": "",
        "distription": "",
        "element": ""        
    })

    yup.setLocale({        
        string: {
            max: "Максимум 10 символов",
        },
      });

    let schema = yup.object().shape({
        name: yup.string()
            .max(10),
        distription: yup.string()
                    .max(10),
        element: yup.number(),        
    });

    

    



    const addHeroes = async (e, title)=> {
        let value = e. target.value
        await schema.isValid({ 
            [title]: e.target.value,
            })
            .then(valid => valid 
                ? setStateHeroes({...stateHeroes, [title]: value})
                : value.length == 0 ? setStateHeroes({...stateHeroes, [title]: value}) 
                : console.log(yup.ValidationError.errors)
                )
            // .catch(err=> console.log(err))
            
            console.log();
        }
    

        


        // setStateHeroes({...stateHeroes, [title]: e.target.value})
    
    

    
    const {request} = useHttp();
    const addHeroesServer = (e)=> {
        request("http://localhost:3001/heroes", "POST", JSON.stringify(stateHeroes))
            .then(data=> console.log(data))
    }


    // Получение фильтров
    const dispatch = useDispatch();
    const getFilters = ()=> {
        request("http://localhost:3001/filters")
            .then(data=> dispatch(filterFetched(data)))        
    }
    useEffect(()=>{
        getFilters(); 
    }, [])

    // Создание option
    const options = useSelector(state=> {
        return state.filters.map((item)=> {
            return(
                <option 
                value={item}
                key={item}>{item}</option> 
            )
        })
        
    })   

    return (
        <form 
        className="border p-4 shadow-lg rounded"
        onSubmit={addHeroesServer}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    onChange={(e)=> addHeroes(e, "name")}
                    value={stateHeroes.name}
                    
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    onChange={(e)=> addHeroes(e, "distription")}
                    value={stateHeroes.distription}
                    
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    onChange={addHeroes}
                    value={stateHeroes.element}
                    
                    className="form-select" 
                    id="element" 
                    name="element">
                    {options}
                </select>
            </div>

            <button 
            type="submit" 
            className="btn btn-primary">
                Создать
            </button>
        </form>
    )
}

export default HeroesAddForm;