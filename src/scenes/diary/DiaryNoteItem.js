import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import NoteDetail from './NoteDetail';
import {displayedCategories} from '../../utils/constants';
import localStorage from '../../utils/localStorage';
import Text from '../../components/MyText';

const DiaryNoteItem = ({navigation, diaryNote, date}) => {
  if (!diaryNote || !diaryNote?.values) return null;
  const handleEdit = (tab) => {};

  const handlePressItem = () => {
    handleEdit('day-survey');
  };

  return (
    <View style={styles.container}>
      {diaryNote?.values
        ?.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
        ?.map((note) => (
          <TouchableOpacity
            key={note.id}
            activeOpacity={1}
            style={styles.item}
            onPress={handlePressItem}>
            <View>
              <NoteDetail note={note} />
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    paddingVertical: 10,
  },
  container: {
    paddingLeft: 15,
    paddingVertical: 10,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: '#00CEF7',
  },
  divider: {
    height: 1,
    backgroundColor: '#6BD1F3',
    marginVertical: 10,
    width: '60%',
    alignSelf: 'center',
  },
});

export default DiaryNoteItem;
