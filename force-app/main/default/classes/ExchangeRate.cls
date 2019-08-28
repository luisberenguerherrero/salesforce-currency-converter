public class ExchangeRate {

	public String code;
	public String name;
	public Decimal rate;
	
	public static List<ExchangeRate> parse(String json) {
		return (List<ExchangeRate>) System.JSON.deserialize(json, List<ExchangeRate>.class);
	}

	public static Map<String, Decimal> parseToMap(String json) {
		List<ExchangeRate> exchangeRates=parse(json);
		Map<String, Decimal> exchangeRatesMap = new Map<String, Decimal>();
		for(ExchangeRate er:exchangeRates){
			exchangeRatesMap.put(er.code, er.rate);
		}
		return exchangeRatesMap;
	}
}