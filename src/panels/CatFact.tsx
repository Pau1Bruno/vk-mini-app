import { FC, useRef, useState } from 'react';
import {
    Button,
    Div,
    Group,
    Header,
    IconButton,
    Input,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Spacing
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon16Clear } from "@vkontakte/icons";

interface Fact {
    fact: string;
    length: string
}

export const CatFact: FC<NavIdProps> = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const inputRef = useRef<HTMLInputElement>(null);
    const [ isFetching, setIsFetching ] = useState<boolean>(false);
    const [ error, setError ] = useState<Error>();
    
    const getCatFact = () => {
        if ( !inputRef.current || isFetching ) return;
        setIsFetching(true);
        fetch("https://catfact.ninja/fact")
            .then(response => response.json())
            .then((data: Fact) => write(data))
            .catch(setError)
            .finally(() => setIsFetching(false));
    }
    
    const write = (data: Fact) => {
        if ( inputRef.current ) {
            inputRef.current.value = data.fact;
            
            let firstSpace = data.fact.indexOf(" ");
            firstSpace = firstSpace > 0 ? firstSpace : data.fact.slice(1).indexOf(" ");
            inputRef.current.selectionStart = firstSpace;
            inputRef.current.selectionEnd = firstSpace;
            
            inputRef.current.focus();
        }
    }
    
    const clear = () => {
        if ( inputRef.current ) {
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    };
    
    return (
        <Panel id={ id }>
            <PanelHeader before={ <PanelHeaderBack onClick={ () => routeNavigator.back() }/> }>
                Факт про котов
            </PanelHeader>
            <Group header={ <Header mode="secondary">Button with interesting fact</Header> }>
                <Div>
                    <Button stretched size="l" mode="secondary" onClick={ getCatFact }>
                        Покажите интересный факт про кошек, пожалуйста!
                    </Button>
                    
                    <Spacing size={ 16 }/>
                    
                    <Input
                        id="fact"
                        getRef={ inputRef }
                        type="text"
                        placeholder="А здесь мог быть интересный факт про котиков :("
                        defaultValue=""
                        after={
                            <IconButton hoverMode="opacity" label="Очистить поле" onClick={ clear }>
                                <Icon16Clear/>
                            </IconButton>
                        }
                    />
                </Div>
            </Group>
        </Panel>
    )
}