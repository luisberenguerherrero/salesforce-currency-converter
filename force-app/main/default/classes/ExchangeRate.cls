/**
 * Class to parse the callout response from Bitpay and handle the returned values easily
 */
public class ExchangeRate {

	public String code;
	public String name;
	public Decimal rate;
	
	/**
	 * parse Parses a JSON serialized string into a List of ExchangeRate objects. Method used by the parseToMap method
	 * @param json The JSON returned by the webservice
	 * @return Return a List of ExchangeRate objects
	 */
	private static List<ExchangeRate> parse(String json) {
		List<ExchangeRate> exchanges;
		try{
			exchanges = (List<ExchangeRate>) System.JSON.deserialize(json, List<ExchangeRate>.class);
		}catch(JSONException e){
			System.debug('Error reading JSON: '+e.getMessage());
			AssignmentException ex=new AssignmentException('Error retrieving the exchange rate, try later or contact with your administrator (PARSING ERROR)');
			throw ex;
		}
		
		return exchanges;
	}

	/**
	 * parseToMap Parses a JSON serialized string into a Map of the existing exchange rates
	 * @param json The JSON returned by the webservice
	 * @return Return a Map of Currency Code - Currency Value
	 */
	public static Map<String, Decimal> parseToMap(String json) {
		List<ExchangeRate> exchangeRates=parse(json);
		Map<String, Decimal> exchangeRatesMap = new Map<String, Decimal>();
		for(ExchangeRate er:exchangeRates){
			exchangeRatesMap.put(er.code, er.rate);
		}
		return exchangeRatesMap;
	}
}