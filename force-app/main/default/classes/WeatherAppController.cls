public without sharing class WeatherAppController {
    public WeatherAppController() {

    }

    @AuraEnabled
    public static string getWeatherDetails(String cityName){
        try {

            String url = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + getApiKey() + '&units=metric';
            String response = getResponse(url);
            return response;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static String getResponse(String url){
        Http http = new Http(); 

        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET'); 
        request.setTimeout(12000);

        HttpResponse response = http.send(request);

        String responseBody = '';
        if(response.getStatusCode() == 200){
            responseBody = response.getBody(); 
        }
        return responseBody;
    }


    private static String getApiKey() {
        String key = 'bc312bd5364e58f3811e225c6e5bc398';
        String output = '&appid=' + key;
        return output;
    }
}