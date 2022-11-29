import { ImageBackground } from "react-native";

const Background = ({ children }) => {
    return (
        <View>
            <ImageBackground source={require("../assets/bkg.png")} style={{ height: '100%' }} />
            <View>
                {children}
            </View>
        </View>
    );
}

export default Background;