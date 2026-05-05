import React, {useState, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Chess} from 'chess.js';
import ChessSquare from './ChessSquare';
import {Piece} from '../chess/types';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export default function ChessBoard() {
  const [game] = useState(() => new Chess());
  const [board, setBoard] = useState(() => game.board());
  const [selected, setSelected] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("White's turn");

  const updateStatus = useCallback(() => {
    if (game.isCheckmate()) {
      setStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins`);
    } else if (game.isDraw()) {
      setStatus('Draw!');
    } else if (game.isCheck()) {
      setStatus(`${game.turn() === 'w' ? 'White' : 'Black'} is in check`);
    } else {
      setStatus(`${game.turn() === 'w' ? 'White' : 'Black'}'s turn`);
    }
  }, [game]);

  const handleSquarePress = useCallback(
    (square: string) => {
      if (game.isGameOver()) return;

      if (selected) {
        const move = game.moves({square: selected as any, verbose: true}).find(
          m => m.to === square,
        );

        if (move) {
          game.move(move);
          setBoard(game.board());
          setSelected(null);
          setValidMoves([]);
          updateStatus();
          return;
        }
      }

      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setSelected(square);
        const moves = game.moves({square: square as any, verbose: true});
        setValidMoves(moves.map(m => m.to));
      } else {
        setSelected(null);
        setValidMoves([]);
      }
    },
    [game, selected, updateStatus],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {RANKS.map((rank, rankIdx) => (
          <View key={rank} style={styles.row}>
            <Text style={styles.label}>{rank}</Text>
            {FILES.map((file, fileIdx) => {
              const square = `${file}${rank}`;
              const cell = board[rankIdx][fileIdx];
              const piece: Piece | null = cell
                ? {type: cell.type, color: cell.color}
                : null;
              const isLight = (rankIdx + fileIdx) % 2 === 0;
              return (
                <ChessSquare
                  key={square}
                  piece={piece}
                  isLight={isLight}
                  isSelected={selected === square}
                  isValidMove={validMoves.includes(square)}
                  onPress={() => handleSquarePress(square)}
                />
              );
            })}
          </View>
        ))}
        <View style={styles.fileLabels}>
          <View style={styles.labelSpacer} />
          {FILES.map(f => (
            <Text key={f} style={[styles.label, styles.fileLabel]}>
              {f}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  board: {
    borderWidth: 2,
    borderColor: '#5a3e1b',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileLabels: {
    flexDirection: 'row',
  },
  label: {
    width: 16,
    fontSize: 10,
    textAlign: 'center',
    color: '#5a3e1b',
    fontWeight: '600',
  },
  fileLabel: {
    flex: 1,
    textAlign: 'center',
  },
  labelSpacer: {
    width: 16,
  },
});
