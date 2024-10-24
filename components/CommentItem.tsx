import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import Avatar from './Avatar';
import moment from 'moment';
import Icon from '@/assets/icons';
import { useTheme as usePaperTheme } from 'react-native-paper';

const CommentItem = ({
  item,
  canDelete = false,
  onDelete = () => {},
  highlight = false,
}) => {
  const paperTheme = usePaperTheme();
  const createdAt = moment(item?.created_at).format('MMM d');

  const handleDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to do this?', [
      {
        text: 'Cancel',
        onPress: () => console.log(`canceled`),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onDelete(item),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image} />
      <View
        style={[
          styles.content,
          {
            backgroundColor: paperTheme.colors.backdrop,
          },
          highlight && [
            styles.highlight,
            {
              backgroundColor: paperTheme.colors.background,
              borderColor: paperTheme.colors.outline,
              shadowColor: paperTheme.colors.shadow,
            },
          ],
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={styles.nameContainer}>
            <Text
              style={[
                styles.text,
                {
                  color: paperTheme.colors.onBackground,
                },
              ]}
            >
              {item?.user?.name}
            </Text>
            <Text>•</Text>
            <Text style={[styles.text, { color: paperTheme.colors.secondary }]}>
              {createdAt}
            </Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Icon name='delete' size={20} color={paperTheme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={[
            styles.text,
            { fontWeight: 'normal', color: paperTheme.colors.onBackground },
          ]}
        >
          {item?.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 7,
  },
  content: {
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  highlight: {
    borderWidth: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  text: {
    fontSize: hp(1.6),
    // @ts-ignore
    fontWeight: theme.fonts.medium,
  },
});
