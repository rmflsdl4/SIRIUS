import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { GetImage } from '../modules/ImageManager';

const Header = ({ address }) => {
    const maxLength = 10;
    const truncatedAddress = address.length > maxLength
        ? `${address.substring(0, maxLength)}...`
        : address;


    return (
        <View style={styles.container}>
            <View style={styles.addrContainer}>
                <Text style={styles.addrText}>{truncatedAddress}</Text>
                <TouchableOpacity>
                    <GetImage type={'ProfileUpdate'} width={21} height={21}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <GetImage type={'Logout'} width={21} height={21}/>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '95%',
        flexDirection: 'row',
        position: 'absolute',
        top: 15,
        justifyContent: 'space-between'
    },
    addrContainer: {
        flexDirection: 'row'
    },
    addrText: {
        fontSize: 17,
        fontFamily: 'KCC-Hanbit',
        marginRight: 15,
        color: 'black'
    },
});
export default Header;