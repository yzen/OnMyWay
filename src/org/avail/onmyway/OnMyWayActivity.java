package org.avail.onmyway;

import android.os.Bundle;
import org.apache.cordova.*;

public class OnMyWayActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/html/index.html", 5000);
    }
}
