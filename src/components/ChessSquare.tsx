import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PIECE_UNICODE, Piece} from '../chess/types';

interface Props {
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  onPress: () => void;
}

export default function ChessSquare({
  piece,
  isLight,
  isSelected,
  isValidMove,
  onPress,
}: Props) {
  const bgColor = isSelected
    ? '#f6f669'
    : isValidMove
    ? isLight
      ? '#cdd26a'
      : '#aaa23a'
    : isLight
    ? '#f0d9b5'
    : '#b58863';

  return (
    <TouchableOpacity
      style={[styles.square, {backgroundColor: bgColor}]}
      onPress={onPress}
      activeOpacity={0.8}>
      {piece && (
        <Text style={[styles.piece, piece.color === 'w' ? styles.white : styles.black]}>
          {PIECE_UNICODE[piece.color][piece.type]}
        </Text>
      )}
      {isValidMove && !piece && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  square: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piece: {
    fontSize: 36,
    lineHeight: 44,
  },
  white: {
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  black: {
    color: '#1a1a1a',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
