import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { GetImage } from '../modules/ImageManager';
// import { ContentsValue, IncrementViews } from "./CommunityDataRouter";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const MenuTitle = ({ board_id, board }) => {
    return board_id === 1 ? (
        <View style={styles.menuTitle}>
            <View style={styles.titleLeft}>
                <GetImage type={'Star'} width={22} height={22} />
                <Text style={{ marginLeft: 5 }}>{board.board_name}</Text>
            </View>
        </View>
    ) : null;
};

const CommunityContentsLeft = ({ board, truncateText }) => {
    return (
        <View style={[styles.communityContentsLeft, { width: board.fileUrl && board.file_name ? '60%' : '100%' }]}>
            <View style={styles.contents_title}>
                <Text style={styles.contentsTitleText}>{board.contents_title}</Text>
            </View>
            <View style={styles.contents}>
                <Text style={styles.contentsText}>{truncateText(board.content, 120)}</Text>
            </View>
            <View style={styles.element}>
                <View style={styles.recommendAndContentsNum}>
                    <GetImage type={'Recommend'} width={22} height={22} />
                </View>
                <View style={styles.recommendAndContentsNum}>
                    <Text>{board.recommend}</Text>
                </View>
                <View style={styles.recommendAndContentsNum}>
                    <GetImage type={'Views2'} width={22} height={22} />
                </View>
                <View style={styles.recommendAndContentsNum}>
                    <Text>{board.views}</Text>
                </View>
            </View>
        </View>
    );
};

const CommunityContentsRight = ({ board, postUrl }) => {
    return (
        board.fileUrl && board.fileName ? (
            <View style={styles.communityContentsRight}>
                <Image
                    source={{ uri: postUrl + `${board.file_url}${board.file_name}` }}
                    style={styles.image}
                />
            </View>
        ) : null
    );
};

const AllContents = ({ board_id }) => {
  const postUrl = 'http://192.168.45.113:8080/';

  const [contents, setContents] = useState([]);
  const navigation = useNavigation();

  const goToPage = (name) => {
    navigation.navigate(name);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await ContentsValue(board_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [board_id]);

  const ContentsValue = (board_id) => {
    console.log("Requested board_id:", board_id);  // board_id 값을 콘솔에 출력

    axios.post(postUrl + 'user/contentListValue', { board_id }, {  // board_id 전송
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    .then((response) => {
        console.log(response.data);
        if(response.data){
          setContents(response.data);
        }
        else{
            Alert.alert('데이터 로드 실패', '커뮤니티 컨텐츠 데이터를 불러오는데 실패했습니다.', [
                { text: '확인', onPress: () => console.log('alert closed') },
            ]);
        }
    })
    .catch(err => console.log(err));
  }

  const viewsCount = async (sendContentsNum) => {
    try {
      await IncrementViews(sendContentsNum);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) {
      return '';
    }
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <ScrollView style={{ width: "100%" }}>
      {contents.map((board, index) => (
        <View key={index} style={styles.communityContentsBox}>
          <MenuTitle board_id={board_id} board={board} />
          <TouchableOpacity
            style={styles.communityContents}
            onPress={() => {
              goToPage(`ContentsComponent?contentsNum=${board.contents_num}`);
              viewsCount(board.contents_num);
            }}
          >
            <CommunityContentsLeft board={board} truncateText={truncateText} />
            <CommunityContentsRight board={board} postUrl={postUrl} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  communityContentsBox: {
    margin: 10,
    width: "100%",
  },
  communityContents: {
    flexDirection: "row",
    width: "100%",
    height: 150,
    borderRadius: 15,
    backgroundColor: "white",
    marginVertical: 10,
    boxSizing: "border-box",
  },
  contentsTitle: {
    width: "100%",
    height: "20%",
    padding: 8,
    boxSizing: "border-box",
  },
  contentsTitleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contents: {
    width: "100%",
    height: "60%",
    padding: 10,
    fontSize: 12,
    whiteSpace: "normal",
    wordWrap: "break-word",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  contentsText: {
    fontSize: 12,
  },
  element: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "20%",
    padding: 8,
    boxSizing: "border-box",
  },
  recommendAndContentsNum: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  menuTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: "inherit",
  },
  communityContentsLeft: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  communityContentsRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    boxSizing: "border-box",
    borderRadius: 15,
  },
  icon: {
    width: 22,
    height: 22,
  },
  image: {
    width: 90,
    height: 90,
  },
});

export default AllContents;
