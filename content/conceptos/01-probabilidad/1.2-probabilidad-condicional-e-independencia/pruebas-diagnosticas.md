---
id: pruebas-diagnosticas
titulo: Pruebas diagnósticas (sensibilidad, especificidad, valor predictivo positivo y negativo)
titulo_en: Diagnostic tests (sensitivity, specificity, positive and negative predictive value)
alias:
  - sensibilidad y especificidad
  - valor predictivo positivo
  - valor predictivo negativo
  - VPP
  - VPN
modulo: 1
submodulo: '1.2'
orden: 8
nivel: basico
prerrequisitos:
  - tasa-base-y-falacia-de-la-tasa-base
relaciones:
  - tipo: relacionado
    id: teorema-de-bayes
etiquetas:
  - medicina
  - sensibilidad
  - especificidad
  - valores predictivos
resumen: >
  La sensibilidad y la especificidad miden qué tan bien una prueba reconoce a enfermos y sanos; los
  valores predictivos dicen qué tan probable es estar enfermo según el resultado, y dependen de la prevalencia.
formula: '\mathrm{VPP} = \frac{s\,\pi}{s\,\pi + (1 - e)(1 - \pi)}, \qquad \mathrm{VPN} = \frac{e\,(1 - \pi)}{e\,(1 - \pi) + (1 - s)\,\pi}'
visualizacion:
  componente: IconArray
  parametros:
    poblacion: 1000
    prevalencia: 0.02
    sensibilidad: 0.9
    especificidad: 0.92
    condicion: tiene diabetes
    positivo: da positivo en la prueba rápida
    contexto: Una prueba rápida de glucosa se aplica a 1000 adultos de una población con 2 % de diabetes no diagnosticada.
referencias:
  - clave: agresti
    capitulo: '2'
  - clave: blitzstein-hwang
    capitulo: '2'
publicado: true
---

## Intuición

Una prueba médica puede equivocarse de dos maneras: decir que una persona enferma está sana (falso negativo) o decir que una sana está enferma (falso positivo). La **sensibilidad** mide qué tan bien encuentra a los enfermos: de cada 100 enfermos, cuántos salen positivos. La **especificidad** mide qué tan bien descarta a los sanos: de cada 100 sanos, cuántos salen negativos. Son propiedades de la prueba, que se miden en estudios con personas cuyo estado se conoce.

Al paciente y al médico, sin embargo, les interesa la pregunta inversa: dado que la prueba salió positiva, ¿qué probabilidad hay de enfermedad? Esa es el **valor predictivo positivo**. Y si salió negativa, ¿qué probabilidad hay de estar sano? El **valor predictivo negativo**. Los valores predictivos se obtienen con el teorema de Bayes y dependen de la prevalencia: la misma prueba tiene valores predictivos muy distintos en un hospital especializado y en una campaña de detección en población general.

## Definición

Con $E$ = "enfermo", $+$ y $-$ los resultados de la prueba y $\pi = P(E)$ la prevalencia:

:::definicion[Medidas de una prueba diagnóstica]
- **Sensibilidad:** $s = P(+ \mid E)$, proporción de enfermos con resultado positivo.
- **Especificidad:** $e = P(- \mid E^{c})$, proporción de sanos con resultado negativo.
- **Valor predictivo positivo:** $\mathrm{VPP} = P(E \mid +)$.
- **Valor predictivo negativo:** $\mathrm{VPN} = P(E^{c} \mid -)$.
:::

Por el teorema de Bayes,
$$
\mathrm{VPP} = \frac{s\,\pi}{s\,\pi + (1 - e)(1 - \pi)}, \qquad \mathrm{VPN} = \frac{e\,(1 - \pi)}{e\,(1 - \pi) + (1 - s)\,\pi}.
$$

En una población de $N$ personas, los cuatro resultados posibles forman la **matriz de confusión**:

| | Positivo | Negativo |
| --- | --- | --- |
| Enfermo | VP $= N\pi s$ | FN $= N\pi(1 - s)$ |
| Sano | FP $= N(1 - \pi)(1 - e)$ | VN $= N(1 - \pi)e$ |

:::figura[La prueba del ejemplo principal enfocada en los negativos: de los 904 negativos, solo 2 están enfermos, así que el valor predictivo negativo es cercano a 0.998.]{componente="IconArray"}
```yaml
poblacion: 1000
prevalencia: 0.02
sensibilidad: 0.9
especificidad: 0.92
condicion: tiene diabetes
positivo: da positivo en la prueba rápida
enfoque: negativos
```
:::

:::nota[Qué significa cada símbolo]
- $E$, $E^{c}$: enfermo y sano.
- $+$, $-$: resultado positivo y negativo de la prueba.
- $\pi$: prevalencia, proporción de enfermos en la población (tasa base).
- $s$: sensibilidad; $e$: especificidad.
- VP, FN, FP, VN: verdaderos positivos, falsos negativos, falsos positivos y verdaderos negativos.
- $N$: tamaño de la población.
- $\mathrm{VPP}$, $\mathrm{VPN}$: valores predictivos positivo y negativo.
- $\mathrm{RV}_{+}$: razón de verosimilitudes positiva, $s/(1 - e)$.
:::

## Cómo usar la visualización

Cada figura es una de 1000 personas. La animación primero marca a las 20 con diabetes, después enmarca a quienes dan positivo y al final deja visibles solo los positivos. Con sensibilidad 0.9 y especificidad 0.92, salen 18 verdaderos positivos y 78 falsos positivos: el VPP es $18/96 \approx 0.19$.

Al subir la prevalencia a 0.2 (por ejemplo, aplicando la prueba solo a personas con síntomas), el VPP sube a cerca de 0.74 con la misma prueba. Al subir la especificidad a 0.99, los falsos positivos bajan a 10 y el VPP sube a 0.64. La tabla de datos muestra la matriz de confusión completa.

## Ejemplo

Una prueba de detección de cáncer colorrectal tiene sensibilidad 0.80 y especificidad 0.95. Se aplica a 10000 personas con prevalencia de 0.5 %.

1. Enfermos: $10000 \cdot 0.005 = 50$; sanos: $9950$.
2. VP $= 0.80 \cdot 50 = 40$; FN $= 10$.
3. FP $= 0.05 \cdot 9950 = 497.5$; VN $= 9452.5$.
4. $\mathrm{VPP} = 40/(40 + 497.5) \approx 0.074$.
5. $\mathrm{VPN} = 9452.5/(9452.5 + 10) \approx 0.9989$.

Un positivo eleva la probabilidad de cáncer de 0.5 % a 7.4 %, lo que justifica una colonoscopía confirmatoria; un negativo la baja de 0.5 % a 0.1 %.

:::figura[El ejemplo del cáncer colorrectal como árbol: la consulta "Enfermo dado positivo" divide 0.004 entre 0.004 + 0.04975.]{componente="ProbabilityTree"}
```yaml
niveles: [Estado, Prueba]
ramas:
  - etiqueta: Enfermo
    prob: 0.005
    ramas:
      - etiqueta: Positivo
        prob: 0.8
      - etiqueta: Negativo
        prob: 0.2
  - etiqueta: Sano
    prob: 0.995
    ramas:
      - etiqueta: Positivo
        prob: 0.05
      - etiqueta: Negativo
        prob: 0.95
consultas:
  - nombre: Enfermo dado positivo
    hojas: [Enfermo/Positivo]
    condicion: [Enfermo/Positivo, Sano/Positivo]
  - nombre: Sano dado negativo
    hojas: [Sano/Negativo]
    condicion: [Enfermo/Negativo, Sano/Negativo]
```
:::

## Propiedades

- **Dependencia de la prevalencia:** el VPP crece y el VPN decrece cuando aumenta la prevalencia; la sensibilidad y la especificidad no dependen de ella.
- **Compromiso entre sensibilidad y especificidad:** si la prueba produce un valor numérico y se elige un umbral, bajar el umbral aumenta la sensibilidad y reduce la especificidad. La curva ROC recorre todos los umbrales.
- **Razones de verosimilitud:** $\mathrm{RV}_{+} = s/(1 - e)$ y $\mathrm{RV}_{-} = (1 - s)/e$ multiplican los momios a priori para dar los momios después de un resultado positivo o negativo.
- **Pruebas en serie:** aplicar una segunda prueba solo a los positivos usa el VPP de la primera como nueva prevalencia, lo que eleva mucho el VPP final.

:::figura[La misma prueba en una población con síntomas, con prevalencia de 20 %: de 1000 personas, 180 verdaderos positivos y 64 falsos positivos dan un VPP de 0.74.]{componente="IconArray"}
```yaml
poblacion: 1000
prevalencia: 0.2
sensibilidad: 0.9
especificidad: 0.92
condicion: tiene diabetes
```
:::

:::figura[Pruebas en serie: un primer positivo lleva la probabilidad de 0.02 a 0.19, y un segundo positivo con una prueba independiente de las mismas características la lleva a cerca de 0.72.]{componente="BayesUpdater"}
```yaml
hipotesis:
  - nombre: Diabetes
    prior: 0.02
  - nombre: Sin diabetes
    prior: 0.98
observaciones:
  - nombre: Positivo
    verosimilitudes: [0.9, 0.08]
  - nombre: Negativo
    verosimilitudes: [0.1, 0.92]
secuencia: [Positivo, Positivo]
```
:::

## Errores comunes

- **Confundir sensibilidad con valor predictivo positivo.** "La prueba detecta el 90 % de los casos" no significa que un positivo implique 90 % de probabilidad de enfermedad.
- **Trasladar los valores predictivos de un estudio a otra población.** Un VPP medido en un hospital de referencia, con prevalencia alta, sobreestima el VPP en una campaña de detección.
- **Creer que un negativo descarta la enfermedad con certeza.** Con sensibilidad 0.9, uno de cada diez enfermos sale negativo; el VPN es alto cuando la prevalencia es baja, pero no es 1.

:::figura[Sensibilidad no es VPP: con sensibilidad 0.95 y especificidad 0.90, en una población con prevalencia de 1 % solo 10 de los 109 positivos están enfermos.]{componente="IconArray"}
```yaml
poblacion: 1000
prevalencia: 0.01
sensibilidad: 0.95
especificidad: 0.9
condicion: tiene la enfermedad
```
:::

## Conexiones

Los valores predictivos son aplicaciones directas del [[teorema-de-bayes]], y su dependencia de la prevalencia es el contenido de la [[tasa-base-y-falacia-de-la-tasa-base]]. Se calculan con [[arboles-de-probabilidad]] o con la [[ley-de-probabilidad-total]] en el denominador. Las mismas medidas, con otros nombres (exhaustividad, precisión, tasa de falsos positivos), evalúan clasificadores en aprendizaje automático, donde la curva ROC y la matriz de confusión ocupan un lugar central.

## Formulario

:::formula[Sensibilidad y especificidad]
$$
s = P(+ \mid E), \qquad e = P(- \mid E^{c})
$$

- $s$: proporción de enfermos que dan positivo; $e$: proporción de sanos que dan negativo.
:::

:::formula[Valor predictivo positivo]
$$
\mathrm{VPP} = P(E \mid +) = \frac{s\,\pi}{s\,\pi + (1 - e)(1 - \pi)}
$$

- $\pi$: prevalencia; $1 - e$: tasa de falsos positivos.
:::

:::formula[Valor predictivo negativo]
$$
\mathrm{VPN} = P(E^{c} \mid -) = \frac{e\,(1 - \pi)}{e\,(1 - \pi) + (1 - s)\,\pi}
$$

- $1 - s$: tasa de falsos negativos.
:::

:::formula[Razones de verosimilitud]
$$
\mathrm{RV}_{+} = \frac{s}{1 - e}, \qquad \mathrm{RV}_{-} = \frac{1 - s}{e}
$$

- Multiplican los momios a priori de enfermedad para obtener los momios después del resultado.
:::
