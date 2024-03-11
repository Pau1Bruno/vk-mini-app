import React, { FC, useRef, useState } from 'react';
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
import { Icon16Clear, Icon28UserOutline } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

interface AgeData {
    age: number;
    name: string;
    count: number;
}

export const PredictAge: FC<NavIdProps> = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const inputRef = useRef<HTMLInputElement>(null);
    const [ formItemStatus, setFormItemStatus ] = useState<FormItemProps["status"]>("default")
    const [ data, setData ] = useState<AgeData>();
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
    
    const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if ( !isValid(e.target.value) ) setFormItemStatus("error");
        else (setFormItemStatus("valid"));
    }
    
    
    const sendRequest = () => {
        console.log("fetching...")
        const fetchAge = async () => {
            console.log(inputRef?.current?.value)
            if ( isFetching || formItemStatus === "error" || !inputRef.current || !inputRef.current.value ) return;
            console.log("Прошли")
            setIsFetching(true);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            fetch(`https://api.agify.io/?name=${ inputRef.current.value }`)
                .then(response => response.json())
                .then(setData)
                .catch(setError)
                .finally(() => setIsFetching(false));
        }
        
        fetchAge().then(() => console.log("fetched"));
    };
    
    console.log(data)
    const clear = () => {
        if ( inputRef.current ) {
            inputRef.current.value = '';
            inputRef.current.focus();
            setFormItemStatus("default");
        }
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
                            getRef={ inputRef }
                            type="text"
                            placeholder="Введите ваше имя, допускаются только буквы"
                            defaultValue=""
                            onChange={ changeInput }
                            after={
                                <IconButton hoverMode="opacity" label="Очистить поле" onClick={ clear }>
                                    <Icon16Clear/>
                                </IconButton>
                            }
                        />
                        
                        <Spacing size={ 16 }/>
                        
                        <Cell before={ <Icon28UserOutline/> } subtitle={ "Примерно ваш возраст" }>
                            { data?.age ? data.age : "Возраст" }
                        </Cell>
                        
                        <Spacing size={ 16 }/>
                        
                        <Button stretched size="l" mode="secondary" onClick={ sendRequest }>
                            Получить предполагаемый возраст
                        </Button>
                    </FormItem>
                </FormLayoutGroup>
            </Group>
        </Panel>
    );
};