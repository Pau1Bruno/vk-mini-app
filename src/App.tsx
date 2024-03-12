import { SplitCol, SplitLayout, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { CatFact, Home, PredictAge } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const App = () => {
    const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
    
    return (
        <QueryClientProvider client={ queryClient }>
            <SplitLayout>
                <SplitCol>
                    <View activePanel={ activePanel }>
                        <Home id="home"/>
                        <CatFact id="cat_fact"/>
                        <PredictAge id="predict_age"/>
                    </View>
                </SplitCol>
            </SplitLayout>
        </QueryClientProvider>
    );
};
