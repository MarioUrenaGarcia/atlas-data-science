---
id: entropia-condicional
titulo: Entropía condicional
titulo_en: Conditional entropy
alias:
  - H(X | Y)
  - equivocación
modulo: 0
submodulo: '0.8'
orden: 4
nivel: intermedio
prerrequisitos:
  - entropia-conjunta
etiquetas:
  - entropía
  - probabilidad condicional
  - regla de la cadena
  - teoría de la información
resumen: >
  La entropía condicional H(X | Y) es la incertidumbre que queda sobre X después de observar Y,
  promediada sobre los valores de Y. Nunca supera H(X) y vale H(X, Y) - H(Y).
formula: 'H(X \mid Y) = \sum_{y} p(y)\, H(X \mid Y = y) = H(X, Y) - H(Y)'
visualizacion:
  componente: InformationViz
  parametros:
    modo: conjunta
    tabla:
      - [0.02, 0.18]
      - [0.2, 0.25]
      - [0.13, 0.22]
    enfoque: condicional
    filas: [bici, auto, metro]
    columnas: [lluvia, seco]
referencias:
  - clave: cover-thomas
    capitulo: '2'
publicado: true
---

## Intuición

Antes de ver el cielo no se sabe si una persona irá al trabajo en bicicleta, en auto o en metro. Si se observa que llueve, la bicicleta casi desaparece de las opciones y la incertidumbre cambia. La entropía condicional responde a la pregunta: en promedio, una vez que se conoce $Y$, ¿cuánta incertidumbre queda sobre $X$?

Se calcula como un promedio de entropías. Para cada valor $y$ se mira la distribución de $X$ restringida a los casos en que $Y = y$ y se calcula su entropía; luego se promedian esas entropías con los pesos $p(y)$. El resultado nunca es mayor que $H(X)$: observar algo, en promedio, no puede aumentar la incertidumbre. En casos particulares sí puede aumentarla, y esa diferencia entre el caso particular y el promedio es fuente de confusiones.

## Definición

:::definicion[Entropía condicional]
Sean $X$ y $Y$ variables discretas con función de masa conjunta $p(x, y)$. La entropía de $X$ dado el valor $Y = y$ es
$$
H(X \mid Y = y) = -\sum_{x} p(x \mid y) \log_2 p(x \mid y),
$$
y la entropía condicional de $X$ dado $Y$ es su promedio
$$
H(X \mid Y) = \sum_{y} p(y)\, H(X \mid Y = y) = -\sum_{x, y} p(x, y) \log_2 p(x \mid y).
$$
:::

Como $p(x \mid y) = p(x, y)/p(y)$, se obtiene la regla de la cadena $H(X, Y) = H(Y) + H(X \mid Y)$.

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias discretas.
- $p(x, y)$: probabilidad conjunta.
- $p(y)$: probabilidad marginal de $Y = y$.
- $p(x \mid y)$: probabilidad de $X = x$ dado $Y = y$.
- $H(X \mid Y = y)$: entropía de $X$ cuando se sabe que $Y = y$.
- $H(X \mid Y)$: entropía condicional, promedio de las anteriores.
:::

## Cómo usar la visualización

La tabla muestra la probabilidad conjunta del medio de transporte y del clima; el diagrama dibuja $H(X)$, $H(Y)$ y $H(X, Y)$ como barras, con el tramo propio de $X$ resaltado: ese tramo es $H(X \mid Y)$. El encabezado calcula $H(X, Y) - H(Y)$. La reproducción parte de la tabla independiente con las mismas marginales y llega a la tabla real.

Al inicio, con independencia, $H(X \mid Y) = H(X) = 1.513$ bits. Al final queda en 1.452 bits: saber si llueve reduce la incertidumbre sobre el transporte en solo 0.061 bits, porque el auto y el metro siguen siendo opciones parecidas con o sin lluvia.

## Ejemplo

En un grupo de estudiantes, $X$ indica si aprueban un examen y $Y$ si asistieron a asesorías:

| | asesoría | sin asesoría |
| --- | --- | --- |
| aprueba | 0.3 | 0.2 |
| reprueba | 0.15 | 0.35 |

1. Marginal de $Y$: $p(\text{asesoría}) = 0.45$ y $p(\text{sin asesoría}) = 0.55$.
2. Con asesoría, $p(\text{aprueba} \mid \text{asesoría}) = 0.3/0.45 = 0.667$, y la entropía es $H_b(0.667) = 0.918$ bits.
3. Sin asesoría, $p(\text{aprueba} \mid \text{sin}) = 0.2/0.55 = 0.364$, y la entropía es $H_b(0.364) = 0.946$ bits.
4. Promedio: $H(X \mid Y) = 0.45 \cdot 0.918 + 0.55 \cdot 0.946 = 0.413 + 0.520 = 0.933$ bits.
5. Comprobación: $H(X, Y) = 1.926$ y $H(Y) = 0.993$, de modo que $H(X, Y) - H(Y) = 0.933$.

Como $H(X) = 1$ bit, saber si asistió a asesoría reduce la incertidumbre sobre el resultado en 0.067 bits.

:::figura[Asesorías y aprobación: la entropía condicional del resultado parte de 1 bit con la tabla independiente y baja a 0.933 bits con la tabla real.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.3, 0.2]
  - [0.15, 0.35]
enfoque: condicional
filas: [aprueba, reprueba]
columnas: [asesoría, sin]
```
:::

## Propiedades

- **Condicionar reduce la entropía en promedio:** $0 \le H(X \mid Y) \le H(X)$, con igualdad a la derecha si y solo si $X$ y $Y$ son independientes.
- **Cero si $X$ es función de $Y$:** $H(X \mid Y) = 0$ si y solo si $X$ queda determinada por $Y$.

:::figura[Una prueba diagnóstica que acierta en 90 % de los casos: la incertidumbre sobre el estado del paciente baja de 1 bit a 0.469 bits al conocer el resultado, la entropía binaria del error de 0.1.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.45, 0.05]
  - [0.05, 0.45]
enfoque: condicional
filas: [enfermo, sano]
columnas: [positivo, negativo]
```
:::

- **Regla de la cadena:** $H(X, Y) = H(Y) + H(X \mid Y) = H(X) + H(Y \mid X)$.
- **Asimetría:** en general $H(X \mid Y) \ne H(Y \mid X)$; las dos difieren en $H(X) - H(Y)$.
- **Más condiciones, menos incertidumbre:** $H(X \mid Y, Z) \le H(X \mid Y)$.

## Errores comunes

- **Creer que cada observación reduce la incertidumbre.** La desigualdad $H(X \mid Y) \le H(X)$ vale para el promedio, no para cada valor $y$. Si una máquina falla con probabilidad 0.1 y una alarma se enciende siempre que falla y, además, en uno de cada nueve días sin falla, entonces $H(X) = 0.469$ bits, pero al ver la alarma encendida la falla tiene probabilidad 1/2 y $H(X \mid Y = \text{encendida}) = 1$ bit. En promedio, $H(X \mid Y) = 0.8 \cdot 0 + 0.2 \cdot 1 = 0.2$ bits.

:::figura[Máquina y alarma: H(X) es 0.469 bits y la entropía condicional promedio termina en 0.2 bits, aunque con la alarma encendida la incertidumbre de ese caso sube a 1 bit.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.8, 0.1]
  - [0, 0.1]
enfoque: condicional
filas: [sin falla, falla]
columnas: [apagada, encendida]
```
:::

- **Confundir $H(X \mid Y)$ con $H(Y \mid X)$.** En la tabla de asesorías las dos casi coinciden, 0.933 y 0.926, solo porque las marginales tienen entropías parecidas.
- **Calcular la entropía de $p(x \mid y)$ como si fuera una sola distribución.** $H(X \mid Y)$ no es la entropía de una distribución, sino un promedio de entropías ponderado por $p(y)$.

## Conexiones

Usa la [[probabilidad-condicional]] dentro de la fórmula de la [[entropia-de-shannon]] y se obtiene de la [[entropia-conjunta]] por la regla de la cadena. Lo que $Y$ le quita a la incertidumbre de $X$, $H(X) - H(X \mid Y)$, es la [[informacion-mutua]]. En la [[desigualdad-de-procesamiento-de-datos]] se comparan entropías condicionales a lo largo de una cadena de variables.

## Formulario

:::formula[Entropía condicional]
$$
H(X \mid Y) = \sum_y p(y)\,H(X \mid Y = y) = -\sum_{x, y} p(x, y)\log_2 p(x \mid y)
$$

- $p(y)$: marginal de $Y$; $p(x \mid y)$: condicional de $X$; $p(x, y)$: conjunta; $H(X \mid Y = y)$: entropía de la condicional para un valor fijo $y$.
:::

:::formula[Regla de la cadena]
$$
H(X, Y) = H(Y) + H(X \mid Y)
$$

- $H(X, Y)$: entropía conjunta; $H(Y)$: entropía de $Y$; $H(X \mid Y)$: entropía condicional.
:::

:::formula[Cota]
$$
0 \le H(X \mid Y) \le H(X)
$$

- $H(X)$: entropía de $X$; la igualdad a la derecha se da solo con independencia.
:::
