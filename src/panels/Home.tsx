import { FC } from 'react';
import { Button, Div, Group, Header, NavIdProps, Panel, PanelHeader, } from '@vkontakte/vkui';
import { UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export interface HomeProps extends NavIdProps {
    fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    
    return (
        <Panel id={ id }>
            <PanelHeader>Главная</PanelHeader>
            
            <Group header={ <Header mode="secondary">Page with interesting fact</Header> }>
                <Div>
                    <Button stretched size="l" mode="secondary" onClick={ () => routeNavigator.push('cat_fact') }>
                        Переход на страницу с интересными фактами о котах
                    </Button>
                </Div>
            </Group>
            
            <Group header={ <Header mode="secondary">Page with age guessing</Header> }>
                <Div>
                    <Button stretched size="l" mode="secondary" onClick={ () => routeNavigator.push('predict_age') }>
                        Переход на страницу с угадыванием возраста по имени
                    </Button>
                </Div>
            </Group>
        </Panel>
    );
};
