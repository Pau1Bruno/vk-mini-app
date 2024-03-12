import React, { FC, useState } from 'react';
import {
    Button,
    Cell,
    FormItem,
    FormItemProps,
    FormLayoutGroup,
    Group,
    Header,
    IconButton,
    Input,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Spacing
} from "@vkontakte/vkui";
import { Icon16Clear } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AgeCard from "../components/AgeCard.tsx";

export interface AgeData {
    age: number;
    name: string;
    count: number;
}

export const PredictAge: FC<NavIdProps> = ({ id }) => {
    const queryClient = useQueryClient();
    const routeNavigator = useRouteNavigator();
    const [ name, setName ] = useState<string>("");
    
    const [ formItemStatus, setFormItemStatus ] = useState<FormItemProps["status"]>("default")
    const [ isFetching, setIsFetching ] = useState<boolean>(false);
    const [ error, setError ] = useState<Error>();
    
    const isValid = (str: string): boolean => {
        for ( let i = 0; i < str.length; i++ ) {
            const charCode = str.charCodeAt(i);
            const englishWordsCondition = (charCode < 65 || (charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 1040));
            const russianWordsCondition = (charCode > 1103);
            if ( englishWordsCondition || russianWordsCondition ) return false;
        }
        
        return true;
    }
    
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if ( !isValid(e.target.value) ) setFormItemStatus("error");
        else (setFormItemStatus("valid"));
    }
    
    const handleClick = async () => {
        if ( isFetching || formItemStatus === "error" || !name ) return;
        
        const cache = queryClient.getQueryData([ "ages", name ]);
        
        if ( cache ) {
            console.log("Получили из кэша, запрос не делаем");
            return
        }
        
        console.log("В кэше нет");
        setIsFetching(true);
        console.log("Запрос отправлен, ждём 3 секунды")
        await new Promise(resolve => setTimeout(resolve, 3000));
        await queryClient.prefetchQuery({
            queryKey: [ 'ages', name ],
            queryFn: () => fetch(`https://api.agify.io/?name=${ name }`)
                .then(res => res.json())
                .catch(setError)
                .finally(() => {
                    setIsFetching(false)
                    console.log("Получили ответ")
                })
        });
    };
    
    const { data } = useQuery<AgeData>({
        queryKey: [ "ages", name ],
        enabled: false,
    });
    
    const clear = () => {
        setName("");
    };
    
    return (
        <Panel id={ id }>
            <PanelHeader before={ <PanelHeaderBack onClick={ () => routeNavigator.back() }/> }>
                Угадывание возраста по имени
            </PanelHeader>
            
            <Group header={ <Header mode="secondary">Query with your name</Header> }>
                <FormLayoutGroup>
                    <FormItem htmlFor="predict_age" top="Форма отправки с именем" status={ formItemStatus }>
                        <Input
                            id="predict_age"
                            value={ name }
                            type="text"
                            placeholder="Введите ваше имя, допускаются только буквы"
                            onChange={ handleInput }
                            after={
                                <IconButton hoverMode="opacity" label="Очистить поле" onClick={ clear }>
                                    <Icon16Clear/>
                                </IconButton>
                            }
                        />
                        
                        <Spacing size={ 16 }/>
                        
                        <AgeCard data={ data } isFetching={ isFetching }/>
                        
                        <Spacing size={ 16 }/>
                        
                        <Button stretched size="l" mode="secondary" onClick={ handleClick }>
                            Получить предполагаемый возраст
                        </Button>
                        
                        <Spacing size={ 16 }/>
                        
                        { error
                            ? <Cell>Error: "{ error.name }" with message: "{ error.message }"</Cell>
                            : <></>
                        }
                    </FormItem>
                </FormLayoutGroup>
            </Group>
        </Panel>
    );
};