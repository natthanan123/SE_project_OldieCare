import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export function ProfileCard({ name, age, email, avatar, badge, room, bmi }) {
  return (
    <View style={styles.card}>
      <Image
        source={avatar ? { uri: avatar } : require('../../assets/login.png')}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name || '—'}</Text>
        <Text style={styles.sub}>{email || (age != null ? `อายุ ${age} ปี` : '-')}</Text>
        {(room || bmi != null) && (
          <Text style={styles.sub2}>
            {room ? `ห้อง ${room}` : ''}{room && bmi != null ? ' · ' : ''}{bmi != null ? `BMI ${bmi}` : ''}
          </Text>
        )}
        {!!badge && (
          <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  sub: { fontSize: 13, color: COLORS.textSub, marginTop: 2 },
  sub2: { fontSize: 12, color: COLORS.textSub, marginTop: 2 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E8FFF1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  badgeText: { color: COLORS.success, fontWeight: '700', fontSize: 11 },
});
