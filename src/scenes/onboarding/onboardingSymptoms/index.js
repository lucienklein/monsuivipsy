import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import Text from '../../../components/MyText';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../../../utils/colors';
import SymptomsExplanation from '../../symptoms/symptoms-explanation';
import {displayedCategories} from '../../../utils/constants';
import localStorage from '../../../utils/localStorage';
import logEvents from '../../../services/logEvents';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import AddElemToList from '../../../components/AddElemToList';
import DiarySvg from '../../../../assets/svg/diary';
import Logo from '../../../../assets/svg/symptoms-setting';
import {ONBOARDING_STEPS} from '../../../utils/constants';

const SymptomScreen = ({navigation, route}) => {
  const explanation =
    'A tout moment, vous pourrez modifier la liste des symptômes que vous souhaitez suivre via l’onglet “Réglages” situé en haut à droite du journal';
  const [chosenCategories, setChosenCategories] = useState({});

  useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SYMPTOMS);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const symptoms = await localStorage.getSymptoms();
      if (symptoms) {
        setChosenCategories(symptoms);
      } else {
        init();
      }
    })();
  }, []);

  const init = () => {
    let categories = {};
    Object.keys(displayedCategories).forEach((cat) => {
      categories[cat] = false;
    });
    setChosenCategories(categories);
  };

  const setToogleCheckbox = (cat, value) => {
    let categories = {...chosenCategories};
    categories[cat] = value;
    setChosenCategories(categories);
  };

  const noneSelected = () => {
    let empty = true;
    Object.keys(chosenCategories).forEach((cat) => {
      chosenCategories[cat] && (empty = false);
    });
    return empty;
  };

  const nextOnboardingScreen = async () => {
    if (noneSelected()) {
      return;
    }
    navigation.navigate('onboarding-drugs');
  };

  useEffect(() => {
    (async () => await localStorage.setSymptoms(chosenCategories))();
  }, [chosenCategories]);

  const handleAddNewSymptom = async (value) => {
    if (!value) return;
    if (value in chosenCategories) return;
    await localStorage.addCustomSymptoms(value);
    setChosenCategories({[value]: true, ...chosenCategories});
    logEvents.logCustomSymptomAdd();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton disabled={noneSelected()} onPress={navigation.goBack} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <Logo style={styles.image} width={30} height={30} />
          <Text style={styles.title}>
            Quels ressentis souhaitez-vous suivre quotidiennement ?
          </Text>
        </View>

        {noneSelected() ? (
          <Text style={styles.alert}>
            Ajouter ou sélectionner au moins 1 symptôme
          </Text>
        ) : null}
        <AddElemToList
          onChange={handleAddNewSymptom}
          placeholder="Ajouter un ressenti"
        />
        {chosenCategories &&
          Object.keys(chosenCategories).map((cat, index) => (
            <View key={index} style={styles.categories}>
              <Text style={styles.label}>
                {displayedCategories[cat] || cat}
              </Text>
              <CheckBox
                animationDuration={0.2}
                boxType="square"
                style={styles.checkbox}
                value={chosenCategories[cat]}
                onValueChange={(newValue) => setToogleCheckbox(cat, newValue)}
                // for android
                tintColors={{true: colors.LIGHT_BLUE, false: '#aaa'}}
                // for ios
                tintColor="#aaa"
                onCheckColor={colors.LIGHT_BLUE}
                onTintColor={colors.LIGHT_BLUE}
                onAnimationType="bounce"
                offAnimationType="bounce"
              />
            </View>
          ))}
        <View style={styles.buttonWrapper}>
          <Button
            title="Valider"
            onPress={nextOnboardingScreen}
            disabled={noneSelected()}
          />
        </View>
      </ScrollView>
      <SymptomsExplanation
        explanation={explanation}
        category={'Informations'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },

  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 35,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  ValidationButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  checkbox: {
    marginHorizontal: 10,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    marginBottom: 13,

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 22,
    fontWeight: '700',
  },
  alert: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  categories: {
    backgroundColor: '#F4FCFD',
    borderColor: '#D4F0F2',
    borderWidth: 0.5,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    color: colors.BLUE,
    fontSize: 17,
    fontWeight: '600',
  },
  labelAddSymptom: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  plusIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    margin: -10,
    marginRight: 10,
  },
  addSymptom: {
    backgroundColor: colors.LIGHT_BLUE,
    color: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginTop: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  textInput: {
    fontSize: 20,
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
  },
  okButtonText: {
    marginTop: 20,
    marginRight: 20,
    fontWeight: 'bold',
    color: colors.BLUE,
  },
});

export default SymptomScreen;
