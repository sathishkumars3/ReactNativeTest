/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useEffect, useReducer} from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SearchComponent} from './components/SearchComponent';
import {PostInfo} from './PostInfo';
const App = () => {
  const ACTIONS = {
    CALL_API: 'call_api',
    SUCCESS: 'success',
    ERROR: 'error',
    RE_RENDER: 'rerender',
    FILTER_DATA: 'filter',
  };
  const initialState = {
    data: [],
    errorMessage: null,
    searchText: '',
  };
  const generateRandomNumber = useCallback(
    (minNumber: number = 1000000000, maxNumber: number = 9000000000) => {
      return Math.floor(
        Math.random() * (maxNumber - minNumber + 1) + minNumber,
      );
    },
    [],
  );
  const updateReRender = useCallback(
    (items: Array<PostInfo>) => {
      return items.map(item => ({
        ...item,
        renderId: generateRandomNumber(),
      }));
    },
    [generateRandomNumber],
  );

  const updatePostResults = useCallback(
    (items: Array<PostInfo>) => {
      const finalInfo = Array(30)
        .fill([...items])
        .reduce((a, b) => a.concat(b));
      const finalResult = finalInfo.map((item, index) => ({
        ...item,
        id: index + 1,
        renderId: generateRandomNumber(),
      }));
      return finalResult;
    },
    [generateRandomNumber],
  );

  const usePostReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.CALL_API: {
        return {...state};
      }
      case ACTIONS.SUCCESS: {
        return {...state, postsInfo: updatePostResults(action.data)};
      }
      case ACTIONS.RE_RENDER: {
        return {
          ...state,
          postsInfo: action.data ? updateReRender(action.data) : null,
        };
      }
      case ACTIONS.FILTER_DATA: {
        if (action.data) {
          const postResult: Array<PostInfo> = action.data;
          return {
            ...state,
            postsInfo: postResult.filter(item =>
              item?.body
                .toLowerCase()
                .includes(action.searchText.toLowerCase()),
            ),
          };
        }
      }
    }
  };
  const [state, dispatch] = useReducer(usePostReducer, initialState);
  const {postsInfo} = state;

  useEffect(() => {
    dispatch({type: ACTIONS.CALL_API});
    const getPosts = async () =>
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(async response => {
          dispatch({
            type: ACTIONS.SUCCESS,
            data: await response.json(),
          });
        })
        .catch(error => {
          dispatch({type: ACTIONS.ERROR, postsInfo: null, errorMessage: error});
        });
    getPosts();
  }, [ACTIONS.CALL_API, ACTIONS.ERROR, ACTIONS.SUCCESS]);

  const renderPostInfo = useCallback<ListRenderItem<PostInfo>>(({item}) => {
    return (
      <View>
        <Text>
          {item.id}: {item.body}
        </Text>
        <Text style={styles.number}> {item.renderId}</Text>
      </View>
    );
  }, []);
  return (
    <View style={styles.container}>
      <Image source={require('./images/doggo_walk.gif')} resizeMode="contain" />
      <SearchComponent
        onRenderPress={() =>
          dispatch({type: ACTIONS.RE_RENDER, data: postsInfo})
        }
        handleOnChangetext={input => {
          dispatch({
            type: ACTIONS.FILTER_DATA,
            data: postsInfo,
            searchText: input,
          });
        }}
      />
      <FlatList
        style={styles.contentStyle}
        keyExtractor={item => item?.id}
        data={postsInfo}
        renderItem={renderPostInfo}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentStyle: {
    flex: 1,
    margin: 5,
  },
  item: {
    borderColor: 'gray',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 0.5,
    backgroundColor: '#F5F5F5',
    elevation: 5,
  },
  gif: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  number: {
    fontWeight: 'bold',
  },
});
