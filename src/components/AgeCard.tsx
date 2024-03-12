import { Cell, SimpleCell, Spacing } from "@vkontakte/vkui";
import { Icon28UserOutline } from "@vkontakte/icons";
import { AgeData } from "../panels/PredictAge.tsx";

interface AgeCardProps {
    data: AgeData | undefined;
    isFetching: boolean
}

const AgeCard = ({ data, isFetching }: AgeCardProps) => {
   
    return (
        <Cell>
            <SimpleCell before={ <Icon28UserOutline/> } subtitle={ "Примерно ваш возраст" }>
                { data?.age === null
                    ? " Нельзя угадать"
                    : data?.age
                        ? data.age
                        : "No data "
                }
            </SimpleCell>
            
            <Spacing size={ 16 }/>
            
            <SimpleCell>{ isFetching ? "fetching... (wait 3 seconds)" : "fetched" }</SimpleCell>
        </Cell>
    );
};

export default AgeCard;