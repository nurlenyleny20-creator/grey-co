import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from '@react-native-clipboard/clipboard';
import { Copy } from 'lucide-react';   // ← Diganti

const TRC20_ADDRESS = "TEJMgm44ANpkq2LZqPBXmg2an1Esk4eBWf";

const AddMoneyScreen = () => {
  const copyAddress = () => {
    Clipboard.setString(TRC20_ADDRESS);
    Alert.alert('✅ Berhasil!', 'Alamat TRC20 telah disalin');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <ScrollView className="flex-1 px-5 pt-6">
        <View className="flex-row items-center mb-8">
          <button className="text-3xl text-white">←</button>
          <Text className="text-white text-2xl font-bold ml-4">Add Money</Text>
        </View>

        <Text className="text-gray-400 text-lg mb-8">Deposit USDT via TRC20</Text>

        <View className="bg-[#121212] rounded-3xl p-8 items-center border border-gray-800">
          <View className="bg-white p-5 rounded-2xl mb-6">
            <QRCode
              value={TRC20_ADDRESS}
              size={230}
              color="#000000"
              backgroundColor="#ffffff"
            />
          </View>

          <View className="w-full bg-[#1A1A1A] p-5 rounded-2xl mb-6">
            <Text className="text-gray-500 text-xs mb-2 tracking-widest">TRC20 ADDRESS</Text>
            <Text className="text-white font-mono text-[15px] leading-relaxed break-all">
              {TRC20_ADDRESS}
            </Text>
          </View>

          <TouchableOpacity
            onPress={copyAddress}
            className="w-full bg-[#00D4FF] py-4 rounded-2xl flex-row items-center justify-center active:bg-[#00B8E0]"
          >
            <Copy className="w-5 h-5 text-black" />
            <Text className="text-black font-semibold text-lg ml-3">Copy Address</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 bg-[#1F1F1F] p-5 rounded-2xl border-l-4 border-yellow-500">
          <Text className="text-yellow-400 font-medium mb-3">⚠️ PERHATIAN</Text>
          <Text className="text-gray-400 text-sm leading-relaxed">
            • Hanya kirim USDT di jaringan TRON (TRC20){'\n'}
            • Minimal deposit 5 USDT{'\n'}
            • Transfer salah = dana hilang{'\n'}
            • Saldo masuk otomatis
          </Text>
        </View>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMoneyScreen;
